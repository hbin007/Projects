import streamlit as st
from PIL import Image
import matplotlib
from selenium import webdriver
from bs4 import BeautifulSoup
import requests
import numpy as np
import pandas as pd
import time
import multiprocessing
from functools import partial
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from fake_useragent import UserAgent
import random


# 무신사 패스준비
def musinsa_url(key_word, page_num):
    print(f"'{key_word}'검색 시작 {page_num}페이지")
    path = []
    ua = UserAgent()
    headers = {
         'User-Agent': ua.random}

    for num in range(1, page_num + 1):
        url = f"https://www.musinsa.com/search/musinsa/goods?q={key_word}&list_kind=small&sortCode=pop&sub_sort=&" \
              f"page={num}&display_cnt=0&saleGoods=&includeSoldOut=&setupGoods=&popular=&category1DepthCode=&category" \
              f"2DepthCodes=&category3DepthCodes=&selectedFilters=&category1DepthName=&category2DepthName=&brandIds=" \
              f"&price=&colorCodes=&contentType=&styleTypes=&includeKeywords=&excludeKeywords=&originalYn=N&tags=" \
              f"&campaignId=&serviceType=&eventType=&type=&season=&measure=&openFilterLayout=N&selectedOrderMeasure=" \
              f"&shoeSizeOption=&groupSale=&d_cat_cd=&attribute="
        res = requests.get(url, headers=headers)
        print(res)
        print(f"{num}번째 크롤링")

        product_url = BeautifulSoup(res.text, 'html.parser')
        li_list = product_url.find_all("li", class_="li_box")

        if len(li_list) == 0:
            break

        for i in range(len(li_list)):
            path.append(li_list[i])
    return path


# 상품 url 크롤링
def url_crawling(i, f_url):
    global li11
    global li00
    item_info = i.find('a', class_="img-block")
    li11.append(item_info['href'])
    li00.append("상품url")
    f_url.append(item_info['href'])

    return f_url


# 상품 name 크롤링
def name_crawling(i):
    global li11
    global li00
    item_info = i.find('a', class_="img-block")
    li11.append(item_info['title'])
    li00.append("제품명")


# 상품 가격 크롤링
def price_crawling(i):
    global li11
    global li00
    item_info = i.find('a', class_="img-block")
    li11.append(item_info['data-bh-content-meta2'])
    li00.append("가격")


# 상품 할인 가격 크롤링
def sale_price_crawling(i):
    global li11
    global li00
    item_info = i.find('a', class_="img-block")
    li11.append(item_info['data-bh-content-meta3'])
    li00.append("할인가격")


# 상품 브랜드 크롤링
def brand_crawling(i):
    global li11
    global li00
    li11.append(i.find('p', class_="item_title").text)
    li00.append("브랜드")


# 크롤링 이벤트 처리
def crawling(path, url_box, name_box, price_box, sale_price_box, brand_box):
    global li11
    global li00
    f_url = []
    new_dic = []
    for i in path:
        if url_box:
            f_url = url_crawling(i, f_url)
        if name_box:
            name_crawling(i)
        if price_box:
            price_crawling(i)
        if sale_price_box:
            sale_price_crawling(i)
        if brand_box:
            brand_crawling(i)
        new_dic.append(dict(zip(li00, li11)))
    return new_dic, f_url


# 세부정보 크롤링
def details_crawling(f_url,  code):
    rand_value = random.randint(1, 3)
    ua = UserAgent()
    headers = {
        "user-agent": ua.random}

    options = webdriver.ChromeOptions()
    # options.add_argument('--headless')
    options.add_argument('window-size=1920x1080')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    # options.add_argument("--proxy-server=socks5://127.0.0.1:9150")
    options.add_argument('disable-gpu')
    options.add_argument(f'user-agent={headers}')
    options.add_experimental_option("excludeSwitches", ["enable-logging"])
    prefs = {'profile.default_content_setting_values': {'cookies': 2, 'images': 2, 'plugins': 2, 'popups': 2,
                                                        'geolocation': 2, 'notifications': 2,
                                                        'auto_select_certificate': 2,
                                                        'fullscreen': 2, 'mouselock': 2, 'mixed_script': 2,
                                                        'media_stream': 2,
                                                        'media_stream_mic': 2, 'media_stream_camera': 2,
                                                        'protocol_handlers': 2,
                                                        'ppapi_broker': 2, 'automatic_downloads': 2, 'midi_sysex': 2,
                                                        'push_messaging': 2,
                                                        'ssl_cert_decisions': 2, 'metro_switch_to_desktop': 2,
                                                        'protected_media_identifier': 2,
                                                        'app_banner': 2, 'site_engagement': 2, 'durable_storage': 2}}
    options.add_experimental_option('prefs', prefs)

    li2 = []

    driver = webdriver.Chrome('chromedriver', options=options)

    half = len(f_url) // 2
    a1_url = f_url[:half]
    a2_url = f_url[half:]

    half2 = len(a1_url) // 2
    b1_url = a1_url[:half2]
    b2_url = a1_url[half2:]

    half3 = len(a2_url) // 2
    b3_url = a2_url[:half3]
    b4_url = a2_url[half3:]
    if code == 1:
        for site1 in b1_url:
            dic = {}
            driver.get(site1)
            time.sleep(rand_value)
            try:
                try:
                    if driver.find_element(By.XPATH,
                                           '//*[@id="page_product_detail"]/div[3]/div[6]'
                                           '/ul/li[1]').text == "Purchase status구매 현황":
                        driver.find_element(
                            By.XPATH, '//*[@id="page_product_detail"]/div[3]/div[6]/ul/li[1]').click()
                        data = driver.page_source
                        html = BeautifulSoup(data, "html.parser")
                        dic["조회수"] = html.find("strong", id="pageview_1m").text
                        dic["누적판매"] = html.find(
                            "strong", id="sales_1y_qty").text
                        dic["좋아요"] = html.find(
                            "span", class_="prd_like_cnt").text
                        dic["이미지url"] = html.find("img", id="bigimg")['src']
                        dic["남성구매비율"] = html.find_all(
                            "dd", class_="label_info_value")[0].get_text()
                        dic["여성구매비율"] = html.find_all(
                            "dd", class_="label_info_value")[1].get_text()
                        dic["~18세"] = html.find_all("span", class_="bar_num")[
                            0].get_text()
                        dic["19세~23세"] = html.find_all(
                            "span", class_="bar_num")[1].get_text()
                        dic["24세~28세"] = html.find_all(
                            "span", class_="bar_num")[2].get_text()
                        dic["29세~33세"] = html.find_all(
                            "span", class_="bar_num")[3].get_text()
                        dic["34세~39세"] = html.find_all(
                            "span", class_="bar_num")[4].get_text()
                        dic["40세~"] = html.find_all("span", class_="bar_num")[
                            5].get_text()
                        li2.append(dic)

                    else:
                        data = driver.page_source
                        html = BeautifulSoup(data, "html.parser")
                        dic["조회수"] = html.find("strong", id="pageview_1m").text
                        dic["누적판매"] = html.find(
                            "strong", id="sales_1y_qty").text
                        dic["좋아요"] = html.find(
                            "span", class_="prd_like_cnt").text
                        dic["이미지url"] = html.find("img", id="bigimg")['src']
                        dic["남성구매비율"] = 0
                        dic["여성구매비율"] = 0
                        dic["~18세"] = 0
                        dic["19세~23세"] = 0
                        dic["24세~28세"] = 0
                        dic["29세~33세"] = 0
                        dic["34세~39세"] = 0
                        dic["40세~"] = 0
                        li2.append(dic)

                except NoSuchElementException:
                    data = driver.page_source
                    html = BeautifulSoup(data, "html.parser")
                    dic["조회수"] = html.find("strong", id="pageview_1m").text
                    dic["누적판매"] = html.find("strong", id="sales_1y_qty").text
                    dic["좋아요"] = html.find("span", class_="prd_like_cnt").text
                    dic["이미지url"] = html.find("img", id="bigimg")['src']
                    dic["남성구매비율"] = 0
                    dic["여성구매비율"] = 0
                    dic["~18세"] = 0
                    dic["19세~23세"] = 0
                    dic["24세~28세"] = 0
                    dic["29세~33세"] = 0
                    dic["34세~39세"] = 0
                    dic["40세~"] = 0
                    li2.append(dic)
            except AttributeError:
                print("1번 error")
                continue
            print("1번 프로세스")

    elif code == 2:
        for site2 in b2_url:
            dic = {}
            driver.get(site2)
            time.sleep(rand_value)
            try:
                try:
                    if driver.find_element(By.XPATH,
                                           '//*[@id="page_product_detail"]/div[3]/div[6]'
                                           '/ul/li[1]').text == "Purchase status구매 현황":
                        driver.find_element(
                            By.XPATH, '//*[@id="page_product_detail"]/div[3]/div[6]/ul/li[1]').click()
                        data = driver.page_source
                        html = BeautifulSoup(data, "html.parser")
                        dic["조회수"] = html.find("strong", id="pageview_1m").text
                        dic["누적판매"] = html.find(
                            "strong", id="sales_1y_qty").text
                        dic["좋아요"] = html.find(
                            "span", class_="prd_like_cnt").text
                        dic["이미지url"] = html.find("img", id="bigimg")['src']
                        dic["남성구매비율"] = html.find_all(
                            "dd", class_="label_info_value")[0].get_text()
                        dic["여성구매비율"] = html.find_all(
                            "dd", class_="label_info_value")[1].get_text()
                        dic["~18세"] = html.find_all("span", class_="bar_num")[
                            0].get_text()
                        dic["19세~23세"] = html.find_all(
                            "span", class_="bar_num")[1].get_text()
                        dic["24세~28세"] = html.find_all(
                            "span", class_="bar_num")[2].get_text()
                        dic["29세~33세"] = html.find_all(
                            "span", class_="bar_num")[3].get_text()
                        dic["34세~39세"] = html.find_all(
                            "span", class_="bar_num")[4].get_text()
                        dic["40세~"] = html.find_all("span", class_="bar_num")[
                            5].get_text()
                        li2.append(dic)

                    else:
                        data = driver.page_source
                        html = BeautifulSoup(data, "html.parser")
                        dic["조회수"] = html.find("strong", id="pageview_1m").text
                        dic["누적판매"] = html.find(
                            "strong", id="sales_1y_qty").text
                        dic["좋아요"] = html.find(
                            "span", class_="prd_like_cnt").text
                        dic["이미지url"] = html.find("img", id="bigimg")['src']
                        dic["남성구매비율"] = 0
                        dic["여성구매비율"] = 0
                        dic["~18세"] = 0
                        dic["19세~23세"] = 0
                        dic["24세~28세"] = 0
                        dic["29세~33세"] = 0
                        dic["34세~39세"] = 0
                        dic["40세~"] = 0
                        li2.append(dic)

                except NoSuchElementException:
                    data = driver.page_source
                    html = BeautifulSoup(data, "html.parser")
                    dic["조회수"] = html.find("strong", id="pageview_1m").text
                    dic["누적판매"] = html.find("strong", id="sales_1y_qty").text
                    dic["좋아요"] = html.find("span", class_="prd_like_cnt").text
                    dic["이미지url"] = html.find("img", id="bigimg")['src']
                    dic["남성구매비율"] = 0
                    dic["여성구매비율"] = 0
                    dic["~18세"] = 0
                    dic["19세~23세"] = 0
                    dic["24세~28세"] = 0
                    dic["29세~33세"] = 0
                    dic["34세~39세"] = 0
                    dic["40세~"] = 0
                    li2.append(dic)
            except AttributeError:
                print("2번 error")
                continue
            print("2번 프로세스")

    elif code == 3:
        for site3 in b3_url:
            dic = {}
            driver.get(site3)
            time.sleep(rand_value)
            try:
                try:
                    if driver.find_element(By.XPATH,
                                           '//*[@id="page_product_detail"]/div[3]/div[6]'
                                           '/ul/li[1]').text == "Purchase status구매 현황":
                        driver.find_element(
                            By.XPATH, '//*[@id="page_product_detail"]/div[3]/div[6]/ul/li[1]').click()
                        data = driver.page_source
                        html = BeautifulSoup(data, "html.parser")
                        dic["조회수"] = html.find("strong", id="pageview_1m").text
                        dic["누적판매"] = html.find(
                            "strong", id="sales_1y_qty").text
                        dic["좋아요"] = html.find(
                            "span", class_="prd_like_cnt").text
                        dic["이미지url"] = html.find("img", id="bigimg")['src']
                        dic["남성구매비율"] = html.find_all(
                            "dd", class_="label_info_value")[0].get_text()
                        dic["여성구매비율"] = html.find_all(
                            "dd", class_="label_info_value")[1].get_text()
                        dic["~18세"] = html.find_all("span", class_="bar_num")[
                            0].get_text()
                        dic["19세~23세"] = html.find_all(
                            "span", class_="bar_num")[1].get_text()
                        dic["24세~28세"] = html.find_all(
                            "span", class_="bar_num")[2].get_text()
                        dic["29세~33세"] = html.find_all(
                            "span", class_="bar_num")[3].get_text()
                        dic["34세~39세"] = html.find_all(
                            "span", class_="bar_num")[4].get_text()
                        dic["40세~"] = html.find_all("span", class_="bar_num")[
                            5].get_text()
                        li2.append(dic)

                    else:
                        data = driver.page_source
                        html = BeautifulSoup(data, "html.parser")
                        dic["조회수"] = html.find("strong", id="pageview_1m").text
                        dic["누적판매"] = html.find(
                            "strong", id="sales_1y_qty").text
                        dic["좋아요"] = html.find(
                            "span", class_="prd_like_cnt").text
                        dic["이미지url"] = html.find("img", id="bigimg")['src']
                        dic["남성구매비율"] = 0
                        dic["여성구매비율"] = 0
                        dic["~18세"] = 0
                        dic["19세~23세"] = 0
                        dic["24세~28세"] = 0
                        dic["29세~33세"] = 0
                        dic["34세~39세"] = 0
                        dic["40세~"] = 0
                        li2.append(dic)

                except NoSuchElementException:
                    data = driver.page_source
                    html = BeautifulSoup(data, "html.parser")
                    dic["조회수"] = html.find("strong", id="pageview_1m").text
                    dic["누적판매"] = html.find("strong", id="sales_1y_qty").text
                    dic["좋아요"] = html.find("span", class_="prd_like_cnt").text
                    dic["이미지url"] = html.find("img", id="bigimg")['src']
                    dic["남성구매비율"] = 0
                    dic["여성구매비율"] = 0
                    dic["~18세"] = 0
                    dic["19세~23세"] = 0
                    dic["24세~28세"] = 0
                    dic["29세~33세"] = 0
                    dic["34세~39세"] = 0
                    dic["40세~"] = 0
                    li2.append(dic)
            except AttributeError:
                print("3번 error")
                continue
            print("3번 프로세스")

    else:
        for site4 in b4_url:
            dic = {}
            driver.get(site4)
            time.sleep(rand_value)
            try:
                try:
                    if driver.find_element(By.XPATH,
                                           '//*[@id="page_product_detail"]/div[3]/div[6]'
                                           '/ul/li[1]').text == "Purchase status구매 현황":
                        driver.find_element(
                            By.XPATH, '//*[@id="page_product_detail"]/div[3]/div[6]/ul/li[1]').click()
                        data = driver.page_source
                        html = BeautifulSoup(data, "html.parser")
                        dic["조회수"] = html.find("strong", id="pageview_1m").text
                        dic["누적판매"] = html.find(
                            "strong", id="sales_1y_qty").text
                        dic["좋아요"] = html.find(
                            "span", class_="prd_like_cnt").text
                        dic["이미지url"] = html.find("img", id="bigimg")['src']
                        dic["남성구매비율"] = html.find_all(
                            "dd", class_="label_info_value")[0].get_text()
                        dic["여성구매비율"] = html.find_all(
                            "dd", class_="label_info_value")[1].get_text()
                        dic["~18세"] = html.find_all("span", class_="bar_num")[
                            0].get_text()
                        dic["19세~23세"] = html.find_all(
                            "span", class_="bar_num")[1].get_text()
                        dic["24세~28세"] = html.find_all(
                            "span", class_="bar_num")[2].get_text()
                        dic["29세~33세"] = html.find_all(
                            "span", class_="bar_num")[3].get_text()
                        dic["34세~39세"] = html.find_all(
                            "span", class_="bar_num")[4].get_text()
                        dic["40세~"] = html.find_all("span", class_="bar_num")[
                            5].get_text()
                        li2.append(dic)

                    else:
                        data = driver.page_source
                        html = BeautifulSoup(data, "html.parser")
                        dic["조회수"] = html.find("strong", id="pageview_1m").text
                        dic["누적판매"] = html.find(
                            "strong", id="sales_1y_qty").text
                        dic["좋아요"] = html.find(
                            "span", class_="prd_like_cnt").text
                        dic["이미지url"] = html.find("img", id="bigimg")['src']
                        dic["남성구매비율"] = 0
                        dic["여성구매비율"] = 0
                        dic["~18세"] = 0
                        dic["19세~23세"] = 0
                        dic["24세~28세"] = 0
                        dic["29세~33세"] = 0
                        dic["34세~39세"] = 0
                        dic["40세~"] = 0
                        li2.append(dic)

                except NoSuchElementException:
                    data = driver.page_source
                    html = BeautifulSoup(data, "html.parser")
                    dic["조회수"] = html.find("strong", id="pageview_1m").text
                    dic["누적판매"] = html.find("strong", id="sales_1y_qty").text
                    dic["좋아요"] = html.find("span", class_="prd_like_cnt").text
                    dic["이미지url"] = html.find("img", id="bigimg")['src']
                    dic["남성구매비율"] = 0
                    dic["여성구매비율"] = 0
                    dic["~18세"] = 0
                    dic["19세~23세"] = 0
                    dic["24세~28세"] = 0
                    dic["29세~33세"] = 0
                    dic["34세~39세"] = 0
                    dic["40세~"] = 0
                    li2.append(dic)
            except AttributeError:
                print("4번 error")
                continue
            print("4번 프로세스")

    driver.close()
    return li2


# 멀티프로세싱
def multi_pro(f_url):
    code_list = [1, 2, 3, 4]
    pool = multiprocessing.Pool(4)
    func = partial(details_crawling, f_url)

    print('---- start _multiprocessing ----')
    multi1 = pool.map(func, code_list)
    pool.close()
    pool.join()
    print('---- end _multiprocessing ----')

    return multi1


# 데이터프레임화
def to_df(new_dic, multi_data):

    df1 = pd.DataFrame(new_dic)
    df1 = df1.replace(0, np.NaN)

    df2 = pd.DataFrame()
    for i in multi_data:
        temp_df = pd.DataFrame(i)
        df2 = pd.concat([df2, temp_df])
    df2 = df2.replace(0, np.NaN)

    df1 = df1.reset_index()
    df2 = df2.reset_index()
    last_df = pd.concat([df1, df2], axis=1)
    last_df = last_df.drop(['index'], axis=1)
    last_df = last_df.replace(0, np.NaN)

    return last_df


# 세부정보 이벤트 처리
def crawling_option(details_box, new_dic, f_url):
    if details_box:
        multi_data = multi_pro(f_url)
        last_df = to_df(new_dic, multi_data)

        return last_df

    else:
        print(new_dic)
        df1 = pd.DataFrame(new_dic)
        print(df1)
        df1 = df1.replace(0, np.NaN)

        return df1


# 최종 크롤링 코드 (main)
def crwaling_fin(d_li):
    start = time.time()
    print("크롤링 시작합니다.")

    global li00
    global li11
    li00 = []
    li11 = []

    path = musinsa_url(d_li[0], d_li[1])
    url_box = 1
    name_box = d_li[2][0]
    price_box = d_li[2][1]
    sale_price_box = d_li[2][2]
    brand_box = d_li[2][3]
    details_box = d_li[2][4]
    # url_box = 1
    # name_box = 1
    # price_box = 1
    # sale_price_box = 1
    # brand_box = 1
    # details_box = 0

    new_dic, f_url = crawling(path, url_box, name_box, price_box, sale_price_box, brand_box)
    final_df = crawling_option(details_box, new_dic, f_url)

    print("time :", time.time() - start)
    print("크롤링 종료입니다.")

    return final_df


# ------------------------------------------------------------------------------------------------
# 이후 스트림릿 코드 작성
# 폰트 조정
d_li = []
matplotlib.rcParams['font.family'] = 'Malgun Gothic'
matplotlib.rcParams['axes.unicode_minus'] = False
st.set_page_config(layout="wide")


# 타이틀
st.sidebar.image("https://d34u8crftukxnk.cloudfront.net/slackpress/prod/sites/6/Musinsa_B.png", width=250)


# 상품 검색창
st.sidebar.header("상품검색")
key_word = st.sidebar.text_input('상품명')
d_li.append(key_word)
page_num = st.sidebar.number_input('검색 페이지 수', min_value=1, max_value=50, value=1)
d_li.append(page_num)


# 크롤링 데이터 분류
key_word2 = st.sidebar.write('어떤 데이터를 크롤링 하시겠습니까?')
checked1 = st.sidebar.checkbox('제품명')
checked2 = st.sidebar.checkbox('가격')
checked3 = st.sidebar.checkbox('할인가격')
checked4 = st.sidebar.checkbox('브랜드')
checked5 = st.sidebar.checkbox('세부정보')


# 버튼세션 처리
if 'button_1' not in st.session_state:
    st.session_state.button_1 = False
if 'button_2' not in st.session_state:
    st.session_state.button_2 = False


def cb1():
    st.session_state.button_1 = True


def cb2():
    st.session_state.button_2 = True


# 이벤트 처리
d_li.append([int(checked1), int(checked2), int(checked3), int(checked4), int(checked5)])
print(d_li)
st.sidebar.button("크롤링", on_click=cb1)


# 임시 데이터
# df = pd.read_csv("C:/Users/playdata/PycharmProjects/pythonProject/123/crawling_musinsa_detail_conc.csv")


# 크롤링 버튼 처리
if st.session_state.button_1:
    with st.spinner('Wait for it...'):
        df = pd.read_csv("C:/Users/playdata/PycharmProjects/pythonProject/123/crawling_musinsa_detail_conc.csv")
        st.balloons()
        st.success('Done!')
        st.subheader("DataFrame 데이터")
        st.dataframe(df, use_container_width=False)


# 데이터 저장 방식 선택
radio2_options = ['xlsx', 'csv', 'txt', 'json']
radio2_selected = st.sidebar.radio('어떤 방식으로 저장하시겠습니까?', radio2_options, index=1)
st.sidebar.write('현재 선택:', radio2_selected)
st.sidebar.button("저장하기", on_click=cb2)

try:
    if st.session_state.button_2 and radio2_selected == radio2_options[0]:
        df.to_excel("musinsa_df.xlsx", index=False)

    elif st.session_state.button_2 and radio2_selected == radio2_options[1]:
        df.to_csv("musinsa_df.csv", encoding="ANSI", index=False)

    elif st.session_state.button_2 and radio2_selected == radio2_options[2]:
        df.to_csv("musinsa_df.txt", sep='\t', encoding="utf-8", index=False)

    elif st.session_state.button_2 and radio2_selected == radio2_options[3]:
        df.to_json("musinsa_df_table.json", force_ascii=False, index=False, orient='table')
        df.to_json("musinsa_df_columns.json", force_ascii=False, orient='columns')
        df.to_json("musinsa_df_index.json", force_ascii=False, orient='index')
        df.to_json("musinsa_df_split.json", force_ascii=False, index=False, orient='split')

except NameError:
    st.error('크롤링을 먼저 진행해주세요!!', icon="🚨")


[col1, col2] = st.columns(2)

with col1:
    st.subheader("EAOOOOOOOOOOOOOOOOOOO")
    image_url = "https://i1.sndcdn.com/artworks-000705954469-k42z0p-t500x500.jpg"
    st.image(image_url, width=450)

with col2:
    st.subheader("AWOOOOOOOOOOOOOOOOOOO")
    image_url = "https://preview.redd.it/b4ww0dmctns01.jpg?auto=webp&s=7135e279cffd58eca2650285e451a0013dd91b2b"
    st.image(image_url, width=450)
