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


def url_crawling(i, f_url):
    global li11
    global li00
    item_info = i.find('a', class_="img-block")
    li11.append(item_info['href'])
    li00.append("상품url")
    f_url.append(item_info['href'])

    return f_url


def name_crawling(i):
    global li11
    global li00
    item_info = i.find('a', class_="img-block")
    li11.append(item_info['title'])
    li00.append("제품명")


def price_crawling(i):
    global li11
    global li00
    item_info = i.find('a', class_="img-block")
    li11.append(item_info['data-bh-content-meta2'])
    li00.append("가격")


def sale_price_crawling(i):
    global li11
    global li00
    item_info = i.find('a', class_="img-block")
    li11.append(item_info['data-bh-content-meta3'])
    li00.append("할인가격")


def brand_crawling(i):
    global li11
    global li00
    li11.append(i.find('p', class_="item_title").text)
    li00.append("브랜드")


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


def main():
    start = time.time()
    print("크롤링 시작합니다.")

    global li00
    global li11
    li00 = []
    li11 = []

    path = musinsa_url("패딩", 1)
    url_box = 1
    name_box = 0
    price_box = 0
    sale_price_box = 0
    brand_box = 0
    details_box = 1

    new_dic, f_url = crawling(path, url_box, name_box, price_box, sale_price_box, brand_box)
    final_df = crawling_option(details_box, new_dic, f_url)

    final_df.to_csv("lol.csv", sep='\t', encoding="utf-8", index=False)

    print("time :", time.time() - start)
    print("크롤링 종료입니다.")


if __name__ == '__main__':
    main()