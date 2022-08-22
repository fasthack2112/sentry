(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([["locale/tr"],{

/***/ "../node_modules/moment/locale/tr.js":
/*!*******************************************!*\
  !*** ../node_modules/moment/locale/tr.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Turkish [tr]
//! authors : Erhan Gundogan : https://github.com/erhangundogan,
//!           Burak Yiğit Kaya: https://github.com/BYK

;(function (global, factory) {
    true ? factory(__webpack_require__(/*! ../moment */ "../node_modules/moment/moment.js")) :
   0
}(this, (function (moment) { 'use strict';

    //! moment.js locale configuration

    var suffixes = {
        1: "'inci",
        5: "'inci",
        8: "'inci",
        70: "'inci",
        80: "'inci",
        2: "'nci",
        7: "'nci",
        20: "'nci",
        50: "'nci",
        3: "'üncü",
        4: "'üncü",
        100: "'üncü",
        6: "'ncı",
        9: "'uncu",
        10: "'uncu",
        30: "'uncu",
        60: "'ıncı",
        90: "'ıncı",
    };

    var tr = moment.defineLocale('tr', {
        months: 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split(
            '_'
        ),
        monthsShort: 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
        weekdays: 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split(
            '_'
        ),
        weekdaysShort: 'Paz_Pzt_Sal_Çar_Per_Cum_Cmt'.split('_'),
        weekdaysMin: 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
        meridiem: function (hours, minutes, isLower) {
            if (hours < 12) {
                return isLower ? 'öö' : 'ÖÖ';
            } else {
                return isLower ? 'ös' : 'ÖS';
            }
        },
        meridiemParse: /öö|ÖÖ|ös|ÖS/,
        isPM: function (input) {
            return input === 'ös' || input === 'ÖS';
        },
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD.MM.YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
        },
        calendar: {
            sameDay: '[bugün saat] LT',
            nextDay: '[yarın saat] LT',
            nextWeek: '[gelecek] dddd [saat] LT',
            lastDay: '[dün] LT',
            lastWeek: '[geçen] dddd [saat] LT',
            sameElse: 'L',
        },
        relativeTime: {
            future: '%s sonra',
            past: '%s önce',
            s: 'birkaç saniye',
            ss: '%d saniye',
            m: 'bir dakika',
            mm: '%d dakika',
            h: 'bir saat',
            hh: '%d saat',
            d: 'bir gün',
            dd: '%d gün',
            w: 'bir hafta',
            ww: '%d hafta',
            M: 'bir ay',
            MM: '%d ay',
            y: 'bir yıl',
            yy: '%d yıl',
        },
        ordinal: function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'Do':
                case 'DD':
                    return number;
                default:
                    if (number === 0) {
                        // special case for zero
                        return number + "'ıncı";
                    }
                    var a = number % 10,
                        b = (number % 100) - a,
                        c = number >= 100 ? 100 : null;
                    return number + (suffixes[a] || suffixes[b] || suffixes[c]);
            }
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 7, // The week that contains Jan 7th is the first week of the year.
        },
    });

    return tr;

})));


/***/ }),

/***/ "../src/sentry/locale/tr/LC_MESSAGES/django.po":
/*!*****************************************************!*\
  !*** ../src/sentry/locale/tr/LC_MESSAGES/django.po ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = {"Username":["Kullanıcı Adı:"],"Permissions":["Yetkiler"],"Default (let Sentry decide)":["Varsayılan (kararı Sentry'e bırak)"],"Most recent call last":["En son arama sonda"],"Most recent call first":["En son arama başta"],"Remove":["Kaldır"],"Continue":["Devam et"],"Priority":["Öncelik"],"Last Seen":["Son Görülme"],"First Seen":["İlk Görülme"],"Frequency":["Sıklık"],"Score":["Skor"],"Name":["İsim"],"URL":["Adres"],"Project":["Proje"],"Active":["Aktif"],"Unresolved":["Çözümlenmemiş"],"Resolved":["Çözümlenmiş"],"error":["hata"],"Events":["Olayla"],"Users":["Kullanıcılar"],"name":["isim"],"user":["kullanıcı"],"Page Not Found":["Sayfa Bulunamadı"],"The page you are looking for was not found.":["Aradığınız sayfa bulunamadı"],"You may wish to try the following:":["Aşağıdakileri denemek isteyebilirsiniz:"],"Cancel":["İptal"],"Confirm Password":["Şifre Doğrula"],"Lost your password?":["Parolanı mı kaybettin?"],"Sign out":["Oturumu kapat"],"Submit":["Gönder"],"Next":["Sonraki"],"Register":["Kayıt"],"Save Changes":["Değişiklikleri Kaydet"],"Method":["Metod"],"Query":["Sorgu"],"ID:":["ID:"],"Username:":["Kullanıcı Adı:"],"Create Issue":["Yeni Sorun Oluştur"],"never":["asla"],"1 day":["1 gün"],"Account":["Hesap"],"username or email":["kullanıcı adı ya da eposta"],"Password":["Şifre"],"password":["parola"],"Email":["Eposta"],"Close":["Kapat"],"Default Role":["Varsayılan Rol"],"Saving changes...":["Değişiklikler kaydediliyor..."],"Unable to cancel deletion.":["Silme işlemi iptal edilemedi."],"[repo] has been successfully added.":["[repo] başarıyla eklendi."],"Unable to add repository.":["Depo eklenemiyor."],"Unable to delete repository.":["Depo silinemedi."],"Disabling...":["Devre dışı bırakılıyor..."],"Plugin was disabled":["Eklenti devre dışı"],"Unable to disable plugin":["Eklenti devre dışı bırakılamıyor"],"Help":["Yardım"],"Unresolve":["Çözümleme"],"Resolve":["Çözümle"],"Edit":["Düzenle"],"Are you sure you wish to delete this comment?":["Bu yorumu silmek istediğinize emin misiniz?"],"Save Comment":["Yorumu Kaydet"],"Write":["Yaz"],"Markdown supported":["Markdown destekleniyor"],"Teams":["Takımlar"],"Invite Member":["Üye Davet Et"],"Projects":["Projeler"],"Issues":["Sorunlar"],"Releases":["Sürümler"],"Details":["Detaylar"],"Exception":["Hata"],"Tags":["Etiketler"],"Release":["Sürüm"],"Previous":["Önceki"],"Collapse":["Daralt"],"Confirm":["Onayla"],"Please enter a valid date in the future":["Lütfen gelecekteki geçerli bir tarih giriniz"],"Date":["Tarih"],"Created":["Oluşturuldu"],"Version":["Versiyon"],"Sort by":["Sıralama"],"Setup":["Kurulum"],"Retry":["Tekrar dene"],"Device":["Cihaz"],"Operating System":["İşletim Sistemi"],"User":["Kullanıcı"],"Language":["Dil"],"Status":["Durum"],"Unknown Browser":["Billinmeyen Tarayıcı"],"Unknown Runtime":["Bilinmeyen Runtime"],"Expand":["Genişlet"],"Hide":["Gizle"],"Show":["Göster"],"Delete":["Sil"],"Actions":["Eylemler"],"Show more":["Daha fazla göster"],"Raw":["Ham Değer"],"Additional Data":["İlave veri"],"SDK":["SDK"],"Level":["Level"],"System":["Sistem"],"Full":["Tam"],"Original":["Orijinal"],"Minified":["Küçültülmüş"],"App Only":["Sadece Uygulama"],"Report":["Rapor"],"in":["içinde"],"at line":["satırında"],"Source Map":["Kaynak Haritası"],"Message":["Mesaj"],"Query String":["Sorgu Dizesi"],"Cookies":["Çerezler"],"Headers":["Başlıklar"],"Environment":["Ortam"],"Body":["Gövde"],"Template":["Şablon"],"Label":["Bu projenin epostaları için özel bir ön ek seç."],"Packages":["Paketler"],"API":["API"],"Docs":["Dokümanlar"],"Contribute":["Katkıda Bulun"],"First seen":["İlk görülme"],"Last seen":["Son Görülme"],"Last 24 Hours":["Son 24 saat"],"Last 30 Days":["Son 30 gün"],"Ownership Rules":["Sahiplik Kuralları"],"Inactive Integrations":["Pasif entegrasyonlar"],"events":["olaylar"],"Save":["Kaydet"],"Role":["Rol"],"Email Address":["Eposta Adresi"],"Oldest":["En eski"],"Older":["Daha eksi"],"Newer":["Daha yeni"],"Newest":["En yeni"],"Filter projects":["Projeleri filtrele"],"All":["Hepsi"],"Disable":["Devre dışı bırak"],"Request Access":["Erişim Talep Et"],"Join Team":["Takıma Katıl"],"Request Pending":["Talep Bekliyor"],"Event":["Olay"],"Organization Settings":["Organizasyon Ayarları"],"Project Settings":["Proje Ayarları"],"Project Details":["Proje Detayları"],"Alerts":["Alarmlar"],"Stats":["İstatistikler"],"Settings":["Ayarlar"],"Members":["Üyeler"],"Admin":["Yönetici"],"Exception Type":["Hata Tipi"],"Error: ":["Hata:"],"There was an unknown problem, please try again":["Bilinmeyen bir sorun oluştu, lütfen tekrar deneyin"],"The device you used for sign-in is unknown.":["Oturum açmak için kullandığınız cihaz bilinmiyor."],"Try Again":["Yeniden Deneyin"],"New Issues":["Yeni Sorunlar"],"Last 24 hours":["Son 24 saat"],"Unknown error. Please try again.":["Bilinmeyen hata. Lütfen tekrar deneyin."],"Use a 24-hour clock":["24'lük saat dilimini kullan"],"Separate multiple entries with a newline.":["Birden fazla girdiyi yeni satır ile ayırın."],"General":["Genel"],"Open Membership":["Açık Üyelik"],"Enhanced Privacy":["Gelişmiş Güvenlik"],"Notifications will be delivered at most this often.":["Bildirimler en fazla bu sıklıkla ulaştırılacaktır."],"Notifications will be delivered at least this often.":["Bildirimler en azından bu sıklıkla ulaştırılacaktır."],"Allowed Domains":["İzin Verilen Alan Adları"],"Server":["Sunucu"],"Organizations":["Organizasyonlar"],"Queue":["Sıra"],"Mail":["E Posta"],"Organization":["Organizasyon"],"Notifications":["Bildirimler"],"Identities":["Kimlikler"],"Close Account":["Hesabı Kapat"],"Release Tracking":["Sürüm Takibi"],"Client Keys":["İstemci Anahtarları"],"Configuration":["Ayar"],"Team":["Takım"],"Integrations":["Entegrasyonlar"],"Unable to change assignee. Please try again.":["Atanan kişi değiştirilemiyor. Lütfen tekrar deneyin."],"Unable to delete events. Please try again.":["Olaylar silinemiyor. Lütfen tekrar deneyin."],"The selected events have been scheduled for deletion.":["Seçilmiş olaylar silinmek için planlandı."],"Unable to merge events. Please try again.":["Olaylar birleştirilemiyor. Lütfen tekrar deneyin."],"The selected events have been scheduled for merge.":["Seçili olaylar birleştirme için planlandı."],"Unable to update events. Please try again.":["Olaylar güncellenemiyor. Lütfen tekrar deneyin."],"Create a new account":["Yeni hesap oluştur"],"Server Version":["Sunucu Versiyonu"],"Python Version":["Python Versiyonu"],"Configuration File":["Ayar dosyası"],"Uptime":["Çalışma Süresi"],"Environment not found (are you using the builtin Sentry webserver?).":["Ortam bulunamadı (yerleşik Sentry web sunucusu mu kullanıyorsun?)."],"SMTP Settings":["SMTP Ayarları"],"From Address":["Gönderen Adresi"],"Host":["Sunucu"],"No":["Hayır"],"Yes":["Evet"],"Test Settings":["Test Ayarları"],"Accepted":["Kabul edildi"],"Dropped":["Düşürüldü"],"Extensions":["Uzantılar"],"Modules":["Modüller"],"Disable the account.":["Hesabı devredışı bırak."],"Permanently remove the user and their data.":["Kullanıcıyı ve verilerini kalıcı olarak kaldır."],"Remove User":["Kullanıcı Sil"],"Superuser":["Süper kullanıcı"],"15 minutes":["15 dakika"],"30 minutes":["30 dakika"],"1 hour":["1 saat"],"2 hours":["2 saat"],"24 hours":["24 saat"],"Save Rule":["Kuralı Kaydet"],"Member":["Üye"],"60 minutes":["60 dakika"],"1 week":["1 hafta"],"all":["hepsi"],"none":["hiçbiri"],"Login":["Giriş Yap"],"All Events":["Tüm Olaylar"],"Add to Bookmarks":["Yer İmlerine Ekle"],"Remove from Bookmarks":["Yer İmlerinden Kaldır"],"Set status to: Unresolved":["Durumu ayarla: Çözümlenmemiş"],"Graph:":["Grafik:"],"24h":["24s"],"This action cannot be undone.":["Bu işlem geri alınamaz."],"Save Current Search":["Mevcut Aramayı Kaydet"],"Custom Search":["Özel Arama"],"Tag":["Etiket"],"Bookmarked By":["Yer işaretine ekleyen"],"Text":["Yazı"],"Enable":["Etkinleştir"],"Create Project":["Proje Oluştur"],"Create Organization":["Organizasyon Oluştur"],"Create a New Organization":["Yeni Organizasyon Oluştur"],"Organization Name":["Organizasyon İsmi"],"Bookmark":["Yer İmleri"],"The issue you were looking for was not found.":["Aradığınız sorun bulunamadı."],"Total":["Toplam"],"Event Details":["Olay Detayları"],"Overview":["Genel Bakış"],"Full Documentation":["Tam Dokümantasyon"],"Configure your application":["Uygulamanı yapılandır"],"All Issues":["Tüm Sorunlar"],"First Event":["İlk Olay"],"Last Event":["Son Olay"],"Search":["Ara"],"Project Name":["Proje Adı"],"14d":["14g"],"Your account has been deactivated and scheduled for removal.":["Hesabınız devre dışı bırakıldı ve kaldırılma için planlandı."],"Thanks for using Sentry! We hope to see you again soon!":["Sentry'i kullandığınız için teşekkürler! Sizi yakın zamanda tekrar görmeyi umuyoruz!"],"API Keys":["API Anahtarları"],"Key":["Anahtar"],"Revoke":["Kaldır"],"Dashboard":["Kontrol panel"],"Remove Organization":["Organizasyonu Kaldır"],"Member Settings":["Üye Ayarları"],"Added":["Eklendi"],"Resend Invite":["Tekrar Davet Gönder"],"Public Key":["Açık Anahtar"],"Leave Team":["Takımdan Çık"],"Your Teams":["Senin Takımların"],"Add Member":["Üye Ekle"],"Remove Team":["Takımı Kaldır"],"Hidden":["Gizli"],"Generate New Key":["Yeni Anahar Oluştur"],"Secret Key":["Gizli Anahtar"],"Client Configuration":["İstemci Yapılandırması"],"Remove Project":["Projeyi Sil"],"You do not have the required permission to remove this project.":["Bu projeyi kaldırmak için gerekli izniniz yoktur."],"This project cannot be removed. It is used internally by the Sentry server.":["Bu proje kaldırılamaz. Sentry sunucusu tarafından kullanılmaktadır."],"Removing this project is permanent and cannot be undone!":["Bu projeyi kaldırmak kalıcıdır ve geri alınamaz!"],"Event Settings":["Olay Ayarları"],"Client Security":["İstemci Güvenliği"],"Enable Plugin":["Eklentiyi Etkinleştir"],"Disable Plugin":["Eklentiyi Devre Dışı Bırak"],"Reset Configuration":["Yapılandırmayı Başa Döndür"],"Instructions":["Talimatlar"],"Create a New Team":["Yeni Takım Oluştur"],"":{"domain":"sentry","plural_forms":"nplurals=2; plural=(n > 1);","lang":"tr"}};

/***/ })

}]);
//# sourceMappingURL=../../sourcemaps/locale/tr.93f8f10df276117676bfe3989a08530a.js.map