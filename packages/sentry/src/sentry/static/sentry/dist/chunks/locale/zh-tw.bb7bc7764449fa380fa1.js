(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([["locale/zh-tw"],{

/***/ "../node_modules/moment/locale/zh-tw.js":
/*!**********************************************!*\
  !*** ../node_modules/moment/locale/zh-tw.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Chinese (Taiwan) [zh-tw]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris

;(function (global, factory) {
    true ? factory(__webpack_require__(/*! ../moment */ "../node_modules/moment/moment.js")) :
   0
}(this, (function (moment) { 'use strict';

    //! moment.js locale configuration

    var zhTw = moment.defineLocale('zh-tw', {
        months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
            '_'
        ),
        monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
            '_'
        ),
        weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
        weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY/MM/DD',
            LL: 'YYYY年M月D日',
            LLL: 'YYYY年M月D日 HH:mm',
            LLLL: 'YYYY年M月D日dddd HH:mm',
            l: 'YYYY/M/D',
            ll: 'YYYY年M月D日',
            lll: 'YYYY年M月D日 HH:mm',
            llll: 'YYYY年M月D日dddd HH:mm',
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
                return hour;
            } else if (meridiem === '中午') {
                return hour >= 11 ? hour : hour + 12;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            }
        },
        meridiem: function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar: {
            sameDay: '[今天] LT',
            nextDay: '[明天] LT',
            nextWeek: '[下]dddd LT',
            lastDay: '[昨天] LT',
            lastWeek: '[上]dddd LT',
            sameElse: 'L',
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
        ordinal: function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'DDD':
                    return number + '日';
                case 'M':
                    return number + '月';
                case 'w':
                case 'W':
                    return number + '週';
                default:
                    return number;
            }
        },
        relativeTime: {
            future: '%s後',
            past: '%s前',
            s: '幾秒',
            ss: '%d 秒',
            m: '1 分鐘',
            mm: '%d 分鐘',
            h: '1 小時',
            hh: '%d 小時',
            d: '1 天',
            dd: '%d 天',
            M: '1 個月',
            MM: '%d 個月',
            y: '1 年',
            yy: '%d 年',
        },
    });

    return zhTw;

})));


/***/ }),

/***/ "../src/sentry/locale/zh_TW/LC_MESSAGES/django.po":
/*!********************************************************!*\
  !*** ../src/sentry/locale/zh_TW/LC_MESSAGES/django.po ***!
  \********************************************************/
/***/ ((module) => {

module.exports = {"Username":["使用者名稱"],"Permissions":["許可"],"Default (let Sentry decide)":["預設(讓Sentry決定)"],"Most recent call last":["時間越近的呼叫排越後面"],"Most recent call first":["時間越近的呼叫排越前面"],"Info":["資訊"],"Remove":["移除"],"Configure":["配置"],"Continue":["繼續"],"Priority":["優先級"],"Last Seen":["最後出現時間"],"First Seen":["首次出現時間"],"Frequency":["頻率"],"Score":["得分"],"Name":["姓名"],"URL":["URL"],"Project":["專案"],"Active":["啟用"],"Unresolved":["未解決"],"Resolved":["已解決"],"Ignored":["忽略"],"error":["錯誤"],"Events":["事件"],"Users":["用戶"],"name":["名稱"],"user":["用戶"],"Page Not Found":["找不到網頁"],"The page you are looking for was not found.":["無法搜尋到您要求的網頁"],"You may wish to try the following:":["您也許可以嘗試以下操作："],"Cancel":["取消"],"Confirm Password":["再一次確認密碼"],"Lost your password?":["密碼遺失了嗎？"],"Sign out":["登出"],"Submit":["送出"],"Next":["下一個"],"Register":["註冊"],"Single Sign-On":["單一登入"],"Auth":["認證"],"Save Changes":["儲存"],"Method":["方法"],"Query":["查詢"],"Fragment":["分段"],"ID:":["ID:"],"Username:":["用戶名稱:"],"Create Issue":["建立問題"],"Link Issue":["問題連結"],"Two-Factor Authentication":["雙因素認證 (2FA)"],"m":["m"],"never":["從不"],"1 day":["1天"],"Account":["帳號"],"username or email":["使用者名稱或email"],"Password":["密碼"],"password":["密碼"],"Email":["Email"],"Close":["關閉"],"Default Role":["預設角色"],"Help":["說明"],"Ignore":["忽略"],"Unresolve":["取消解決"],"Resolve":["解決"],"This event is resolved due to the Auto Resolve configuration for this project":["由於此專案「自動解決」的設定，該事件已解決"],"Edit":["編輯"],"Are you sure you wish to delete this comment?":["確定要刪除此註解嗎？"],"Save Comment":["儲存註解"],"Post Comment":["張貼註解"],"Write":["寫入"],"Markdown supported":["支援 Markdown"],"Teams":["團隊"],"Invite Member":["邀請成員"],"Projects":["專案"],"Issues":["問題"],"Releases":["版本"],"Details":["詳細訊息"],"Exception":["异常"],"Tags":["標籤"],"Release":["版本"],"Successfully saved avatar preferences":["已成功儲存頭像偏好"],"Avatar":["頭像"],"Avatar Type":["頭像類型"],"Change Photo":["更換照片"],"Success!":["成功！"],"Previous":["上一個"],"Collapse":["收合"],"Confirm":["確認"],"Date":["日期"],"Created":["已建立"],"Version":["版本"],"Sort by":["依以下條件排序："],"Setup":["設定"],"Retry":["重試"],"Device":["裝置"],"Operating System":["作業系統"],"User":["用户"],"Language":["語言"],"Status":["狀態"],"Unknown Browser":["未知的瀏覽器"],"Unknown Device":["未知的裝置"],"Version:":["版本："],"Unknown OS":["未知的作業系統"],"Unknown User":["未知的使用者"],"Expand":["展開"],"Hide":["隱藏"],"Show":["顯示"],"Delete":["刪除"],"Actions":["動作"],"Show less":["顯示較少"],"Show more":["顯示更多"],"Snooze":["延遲"],"Raw":["原始"],"Additional Data":["附加数据"],"System":["系統"],"Full":["完整"],"Minified":["最小化"],"App Only":["僅限應用程式"],"most recent call first":["時間越近的呼叫排越前面"],"most recent call last":["時間越近的呼叫排越後面"],"Report":["報告"],"CSP Report":["CSP 報告"],"Path":["路徑"],"in":["in"],"at line":["位置行："],"Source Map":["來源對應"],"Message":["訊息"],"Query String":["查詢字串"],"Cookies":["Cookie"],"Headers":["標頭"],"Environment":["環境"],"Body":["本文"],"Template":["範本"],"Filename":["檔案名稱"],"Label":["標籤"],"Other":["其他"],"Packages":["套件"],"API":["API"],"Docs":["文件"],"Contribute":["貢獻"],"Regression":["衰退"],"First seen":["首次查看"],"Last seen":["最後一次查看"],"Last 24 Hours":["過去 24 小時"],"Last 30 Days":["過去 30 天"],"View more":["查看詳情"],"Inactive Integrations":["未啟用的整合"],"There don't seem to be any events fitting the query.":["似乎沒有任何事件符合查詢結果。"],"events":["事件"],"There was an error loading data.":["載入資料時發生錯誤。"],"Save":["儲存"],"Back":["返回"],"Done":["完成"],"Role":["角色"],"Skip this step":["跳過這個步驟"],"Email Address":["E-Mail 信箱"],"You will not be notified of any changes and it will not show up by default in feeds.":["您將不會收到任何變更的通知，且根據預設也不會顯示於摘要中。"],"Oldest":["時間最早"],"Older":["時間較早"],"Newer":["時間較近"],"Newest":["時間最近"],"Create a project":["建立專案"],"Apply":["套用"],"Filter projects":["篩選專案"],"Disable":["禁用"],"Request Access":["要求存取權"],"Join Team":["加入團隊"],"Request Pending":["要求等待中"],"Event":["事件"],"Organization Settings":["組織設定"],"Project Settings":["專案設定"],"Project Details":["專案詳細訊息"],"Clear":["清除"],"User Feedback":["使用者回饋"],"Alerts":["警示"],"Stats":["統計"],"Settings":["設定"],"Members":["成員"],"Admin":["管理員"],"Exception Type":["例外狀況種類"],"n/a":["不可用"],"No recent data.":["undefined"],"Tag Details":["標籤細節"],"Team Name":["團隊名稱"],"Support":["幫助"],"Error: ":["錯誤："],"Try Again":["再試一次"],"New Issues":["新問題"],"Last 24 hours":["過去 24 小時"],"Unknown error. Please try again.":["發生不明錯誤，請再試一次"],"Use a 24-hour clock":["使用 24 小時制"],"Separate multiple entries with a newline.":["使用換行來切割多筆資訊"],"General":["常規"],"Open Membership":["開啟「成員資格」"],"Allow Shared Issues":["允許共享的事件"],"Enhanced Privacy":["增強隱私權"],"Notifications will be delivered at most this often.":["通知傳送頻率不會超過此值"],"Notifications will be delivered at least this often.":["通知傳送頻率不會低於此值"],"Allowed Domains":["允許的網域"],"Enable JavaScript source fetching":["啟用 JavaScript 來源擷取"],"Data Scrubber":["資料清除程式"],"Popular":["熱門"],"Server":["服務器"],"Organizations":["組織"],"Queue":["佇列"],"Mail":["郵件"],"Organization":["組織"],"Notifications":["提醒"],"Emails":["信箱"],"Security":["安全性"],"Identities":["身份"],"Close Account":["關閉帳號"],"Release Tracking":["版本追蹤"],"Client Keys":["用戶端金鑰"],"Configuration":["配置"],"Audit Log":["稽核紀錄"],"Rate Limits":["速率限制"],"Team":["團隊"],"Integrations":["整合"],"Unable to change assignee. Please try again.":["無法變更被指派者，請再試一次。"],"Unable to delete events. Please try again.":["無法刪除事件，請再試一次。"],"The selected events have been scheduled for deletion.":["選取的事件已排定準備刪除。"],"Unable to merge events. Please try again.":["無法合併事件，請再試一次。"],"The selected events have been scheduled for merge.":["選取的事件已排定準備合併。"],"Unable to update events. Please try again.":["無法更新事件，請再試一次。"],"Create a new account":["申請帳號"],"Server Version":["伺服器版本"],"Python Version":["Python版本"],"Configuration File":["配置文件"],"Uptime":["運作時間"],"Environment not found (are you using the builtin Sentry webserver?).":["找不到環境參數(您正在使用Sentry內建的伺服器嗎?)"],"Send an email to your account's email address to confirm that everything is configured correctly.":["發送一封測試信到您帳號指定的 E-mail 信箱確定您的配置是否正確。"],"SMTP Settings":["SMTP 設定"],"From Address":["來源地址"],"Host":["主機"],"not set":["沒有設定"],"No":["否"],"Yes":["是"],"Test Settings":["測試信箱設定"],"Accepted":["已接受"],"Dropped":["已捨棄"],"System Overview":["系統概況"],"Extensions":["擴充套件"],"Modules":["模組"],"Disable the account.":["停用此帳號"],"Permanently remove the user and their data.":["永久移除这个用户及其数据"],"Remove User":["删除用戶"],"Designates whether this user can perform administrative functions.":["指定此使用者能否執行管理功能。"],"Superuser":["超級使用者"],"Designates whether this user has all permissions without explicitly assigning them.":["指定此使用者是否擁有所有權限，無須特地指派。"],"Welcome to Sentry":["歡迎來到 Sentry"],"SMTP Host":["SMTP 主機"],"SMTP Port":["SMTP 連接埠"],"SMTP Username":["SMTP 使用者名稱"],"SMTP Password":["SMTP 密碼"],"The project you were looking for was not found.":["找不到您要搜尋的專案。"],"5 minutes":["5 分鐘"],"10 minutes":["10 分鐘"],"15 minutes":["15 分鐘"],"30 minutes":["30 分鐘"],"1 hour":["1 小時"],"2 hours":["2 小時"],"24 hours":["24小時"],"Save Rule":["儲存規則"],"Member":["成員"],"60 minutes":["60 分鐘"],"3 hours":["3 小時"],"12 hours":["12 小時"],"1 week":["1 星期"],"30 days":["30 天"],"all":["全部"],"any":["任何"],"none":["無"],"Apply Changes":["套用變更"],"History":["歷程"],"Edit Rule":["編輯規則"],"Login":["登入"],"Recently Viewed":["最近瀏覽"],"All Events":["所有事件"],"Add to Bookmarks":["加入「書籤」"],"Remove from Bookmarks":["從「書籤」中移除"],"Set status to: Unresolved":["將狀態設為：未解決"],"Graph:":["圖表："],"24h":["24  小時"],"This action cannot be undone.":["此動作無法復原。"],"Saved Searches":["儲存搜尋條件"],"Custom Search":["自訂搜尋"],"Tag":["標籤"],"Text":["文字"],"Search title and culprit text body":["搜尋標題及造成問題的文字本文"],"Enable":["啟用"],"Select a platform":["選擇平台"],"Create Project":["建立專案"],"The organization you were looking for was not found.":["找不到您要搜尋的組織。"],"Create Organization":["建立組織"],"Create a New Organization":["建立新組織"],"Organizations represent the top level in your hierarchy. You'll be able to bundle a collection of teams within an organization as well as give organization-wide permissions to users.":["「組織」代表階層中的最高層級。您將可以集合組織中的多個團隊，並賦予使用者適用於整個組織的權限。"],"Organization Name":["組織名稱"],"Bookmark":["书签"],"The issue you were looking for was not found.":["找不到您要搜尋的問題。"],"More Details":["詳細資訊"],"Affected Users":["受影響的使用者"],"Learn More":["了解更多"],"Enabled":["啟用"],"Total":["總計"],"Overview":["概況"],"Trends":["趨勢"],"Full Documentation":["完整文件"],"Create a team":["建立團隊"],"Configure your application":["設定您的應用程式"],"Get started by selecting the platform or language that powers your application.":["開始前，請先選取支援您應用程式的平台或語言。"],"DSN":["DSN"],"All Issues":["全部事件"],"First Event":["第一個事件"],"Last Event":["最後一個事件"],"Search":["搜尋"],"Project Name":["專案名稱"],"14d":["14 天"],"Your account has been deactivated and scheduled for removal.":["您的帳號已停用，並已排定準備移除。"],"Thanks for using Sentry! We hope to see you again soon!":["感謝使用 Sentry！希望能儘快與您相見！"],"Device name":["裝置名稱"],"Add Another Device":["新增裝置"],"API Keys":["API 金鑰"],"Edit API Key":["編輯 API 金鑰"],"Key":["金鑰"],"Revoke":["重新配發"],"Dashboard":["儀表盤"],"Remove Organization":["移除組織"],"Member Settings":["成員設定"],"Basics":["基本資料"],"Added":["已新增"],"Invite Link":["邀請連結"],"Generate New Invite":["產生新邀請"],"Resend Invite":["重新發送邀請"],"Public Key":["公開金鑰"],"Leave Team":["離開團隊"],"Your Teams":["您的團隊"],"Add Member":["新增成員"],"Remove Team":["移除團隊"],"Hidden":["不可見的"],"Generate New Key":["產生新的金鑰"],"Secret Key":["安全金鑰"],"Project ID":["專案編號"],"Client Configuration":["用戶端設定"],"Token":["權杖"],"Webhook":["Webhook"],"Remove Project":["删除项目"],"You do not have the required permission to remove this project.":["您沒有移除此專案所需的權限。"],"This project cannot be removed. It is used internally by the Sentry server.":["此專案用於 Sentry 伺服器內部，無法移除。"],"Removing this project is permanent and cannot be undone!":["移除此專案是永久生效的動作，日後無法復原！"],"Event Settings":["事件設定"],"Client Security":["客戶端安全"],"Enable Plugin":["啟用外掛程式"],"Disable Plugin":["停用外掛程式"],"Reset Configuration":["重設設定"],"Instructions":["指示"],"Artifacts":["成品"],"Create a New Team":["建立新團隊"],"":{"domain":"sentry","plural_forms":"nplurals=1; plural=0;","lang":"zh_TW"}};

/***/ })

}]);
//# sourceMappingURL=../../sourcemaps/locale/zh-tw.102427aff1b5390eeb5d0bb9a3094ff7.js.map