## ENTEGRASYON DOKÜMANI

## 3D PAY HOSTING MODELİ

#### Versiyon 1.

#### 24 Nisan 2014


```
Versiyon^ Tarih^ Açıklama^
1.1 04 Mayıs 2012
Bankadan dönen Hash parametresi
için önemli not eklendi.
1.2 24 Nisan 2014
İsteğe bağlı parametrelerde değişiklik
yapıldı.
```
### INDEX

3D Pay Model..................................................................................................................................
Nestpay 3D Pay Model .................................................................................................. ................
**Hızlı Başlangıç Kılavuzu.....................................................................................................** ............
Kullanıcı Doğrulaması için Hash Oluşturma............................................................................................
Gönderilerin Gizli Parametreler...............................................................................................................
Zorunlu Parametre Seti ile HTTP Örneği............................................................................................................
VISA Ödeme Sayfası..............................................................................................................................
3D Doğrulama.........................................................................................................................................
İşlem Sonuç Sayfası...............................................................................................................................
Üye İş Yeri Başarılı İşlem Sayfası...........................................................................................................
Doğrulanmış Başarılı 3D İşlem için Temel İşlem Yanıt Parametreleri................................................................^
Temel Entegrasyonlar....................................................................................................................
HTTP Gönderimi İle Entegrasyon...........................................................................................................
HTTP Formunda Zorunlu ve İsteğe Bağlı Parametrelere Örnek.........................................................................
Kart İşlemleri......................................................................................................................................................
MPI yanıt Parametreleri................................................................................................................................
Olası mdStatus Değerleri..............................................................................................................................
Başarılı İşlem................................................................................................................................................
Başarısız İşlem.............................................................................................................................................
İşlem Yanıt Parametreleri..............................................................................................................................
MPI yanıt Parametreleri................................................................................................................................
Olası İşlem Sonuçları....................................................................................................................................
Hash Kontrolü.........................................................................................................................................
Hash için Plain Text Oluşturma...........................................................................................................................
**Kod Örnekleri..............................................................................................................** ....................
ASP Kod Örnekleri..................................................................................................................................
Gönderilen Kod Örneği.......................................................................................................................................
Dönüş Kod Örneği..............................................................................................................................................
.Net Kod Örnekleri..................................................................................................................................
Gönderilen Kod Örneği....................................................................................................................................
Response Code Sample...................................................................................................................................
JSP Kod Örnekleri..................................................................................................................................
Gönderilen Kod Örneği....................................................................................................................................
Dönüş Kod Örneği ..........................................................................................................................................
PHP Kod Örnekleri..................................................................................................................................
Gönderilen Kod Örneği.......................................................................................................................................
Dönüş Kod Örneği..............................................................................................................................................^
**Ek A: Geçit** Parametreleri...............................................................................................................
Girişi Zorunlu olan Parametreler.............................................................................................................
Girişi İsteğe Bağlı olan Parametreler.......................................................................................................
İşlem Yanıt Parametreleri........................................................................................................................
MPI Yanıt Parametreleri..........................................................................................................................



# 3D Pay Model

```
3D Pay, 3D işlemleri destekleyen, ödeme sayfasına temel internet
entegrasyon modelidir.
Temel Özellikler:
```
- 3D ile, Kredi Kartı ile yapılan işlemlerin güvenliğini sağlar.
- Üye iş yeri entegrasyonu için HTTP Post metodunu kullanır.
- Kredi kartı sayfası üye iş yeri tarafında tutulur.
- Ödeme işlemi Nestpay tarafından otomatik tamamlanır.
Gerekli olan tüm alışveriş verileri müşteriden sağlandıktan sonra, üye iş yeri
sunucusunda benzersiz bir Sipariş Numarası oluşturulur. Bu sipariş numarası ve
gerekli parametler (Sipariş tutarı, para birimi, müşteri adı/soyadı gibi) Nestpay' e
(ödeme geçidi) HTTP Post metodu ile gönderilir.
Kart ödeme metotlarında üye iş yeri sunucusu kart detaylarını yani kart numarası, kart
güvenlik numarasını ve son kullanma tarihi gibi bilgileri ibraz etmesi gerekir. Kart
bilgileri müşteriden elde edildikten ve Sipariş verildikten sonra 3D akışı (kayıt ve
doğrulama sorgulaması) başlar. 3D akışında, müşterinin 3D doğrulama bilgileri kartı
veren banka tarafından doğrulanır. Bankanın müşteriyi doğrulamak için kullandığı
yöntemler değişiklik gösterebilir. Örneğin; 3D doğrulama metodunun kullanımında
bankaya göre 3D güvenlik şifresi, tek kullanımlık şifre, güvenlik sorusu gibi
yöntemlerle farklılık gösterir.
1. Kart bilgileri Nestpay tarafından alındığı için, müşteri bu bilgilerin üye iş
yeri tarafından kaydedilmediğini bilir.
2. Entegrasyon süreci kolaydır.
3. Üye iş yeri zorunlu olan bilgiler dışında kendi istediği verileri de POST edebilir
ve bu bilgileri bankadan geri alır. Örneğin; kullanıcı adı, kullanıcı e-posta
adresi, kullanıcı kimlik numarası gibi.


# Nestpay 3D Pay Model

```
3D Pay Model Diyagram
```

# Hızlı Başlangıç Kılavuzu

```
3D Pay modelinde başarılı bir Visa satış işleminde;
```
## Kullanıcı Doğrulaması için Hash Oluşturma

```
Hash'lenmiş satır SHA1 algoritması kullanılarak ve based64-kodlama versiyonu ile
oluşturulur. Kullanıcı doğrulama için Hash'lenmiş (karma) satır oluşturmak için;
```
- Verilen sipariş ile aşağıdaki değerleri ekleyin:
    **plaintext** = clientid + oid + amount + okurl + failurl + transaction
    type + instalment + rnd+storekey ;
**Verilen Parametreler
clienid** : 990000000000001
**oid** : 1291899411421
**amount** : 91.
**okurl** : https://www.teststore.com/success.php
**failurl** : https://www.teststore.com/fail.php
**transaction type** : Auth
**instalment** : 2
**rnd** : asdf
**storekey** : 123456
**Hash
plaintext** = 990000000000001129189941142191.
https://www.teststore.com/success.phphttps://www.teststore.com/fail.phpAuth
asdf **123456
Hash** = Base64(SHA1(plaintext))


### Gönderilerin Gizli Parametreler

```
Zorunlu girdi parametrelerini gizli olarak Nestpay Ödeme Geçidinde yer
alan https://host/fim/est3dgate linkine gönderilir.
clientid : Merchant ID (given by Nestpay)
storetype : “3d_pay”
hash : Hash value for client authentication
islemtipi : "Auth"
amount : amount transaction amount
currency : ISO code of transaction currency (949 for TL)
oid : Unique identifier of the order
okUrl : The return URL to which Nestpay Payment Gateway redirects the
browser of the customer if transaction is completed successfully.
failUrl : The return URL to which Nestpay Payment Gateway redirects the
browser of the customer if transaction is completed unsuccessfully.
lang : Language of the payment pages hosted by Nestpay ("tr" for Turkish, "en"
for English)
pan : Card number
Ecom_Payment_Card_ExpDate_Year : Expiry year
Ecom_Payment_Card_ExpDate_Month : Expiry month
```
#### Zorunlu Parametre Seti ile HTTP Örneği

<form method="post" action= **"https://host/fim/est3dgate">**
<input type="hidden" name=" **clientid** " value="990000000000001"/>
<input type="hidden" name=" **storetype** " value="3d_pay" />
<input type="hidden" name=" **hash"** value="iej6cPOjDd4IKqXWQEznXWqLzLI=" />
<input type="hidden" name=" **islemtipi** " value="Auth" />
<input type="hidden" name=" **amount** " value="91.96" />
<input type="hidden" name=" **currency** " value="949" />
<input type="hidden" name=" **oid** " value="1291899411421" />
<input type="hidden" name=" **okUrl** " value="https://www.teststore.com/success.php"/>
<input type="hidden" name=" **failUrl** " value="https://www.teststore.com/fail.php" />
<input type="hidden" name=" **lang** " value="en" />
<input type="hidden" name="rnd" value="asdf" />
<input type="hidden" input name=" **pan** " value="4242424242424242">
<input type="hidden" input name=" **Ecom_Payment_Card_ExpDate_Year** " value="28" >
<input type="hidden" input name=" **Ecom_Payment_Card_ExpDate_Month** " value="10">
</form>


### VISA Ödeme Sayfası

```
Müşteri kart bilgilerini bu ekranda girer ve ödeme butonuna basarak
işlemi gerçekleştirmiş olur.
Şekil - 1
```
### 3D Doğrulama

```
3D akışında, müşterinin 3D doğrulama bilgileri kartı veren banka tarafından
doğrulanır. Bankanın müşteriyi doğrulamak için kullandığı yöntemler değişiklik
gösterebilir. Örneğin; 3D doğrulama metodunun kullanımında bankaya göre 3D
güvenlik şifresi, tek kullanımlık şifre, güvenlik sorusu gibi yöntemlerle farklılık gösterir.
```
### İşlem Sonuç Sayfası

```
İşlem sonucu müşteriye görüntülenir. Eğer işlem başarılı ise doğrulama numarası
görüntülenir. Sayfanın yenileme süresi bitince müşteri üye iş yerinin okUrl
sayfasına yönlendirilir.
Şekil - 2
```
### Üye İş Yeri Başarılı İşlem Sayfası

```
İşlem başarılı ise müşteri okUrl sayfasına yönlendirilir. Üye iş yeri tarafından gönderilen
tüm parametreler üye iş yerine geri döner. Üye iş yeri parametrelerin yanı sıra, ağ
geçidi yanıt parametrelerini döndürür ve MPI yanıt parametreleri (3D güvenli işlem
akışı ile ilgili) Ek A. da mevcuttur.
```

#### Doğrulanmış Başarılı 3D İşlem için Temel İşlem

#### Yanıt Parametreleri

```
Response: "Approved" (Onaylanmış)
AuthCode: İşlemin doğrulama kodu
HostRefNum: Banka referans numarası
ProcReturnCode: “00” (başarılı işlemlerde dönen değer)
TransId: İşlem numarası (benzersiz
oluşturulur) mdStatus : “1”
Yukarıdaki örnekte işlem için işlem yanıt parametreleri aşağıdaki gibidir:
Response: " Approved "
AuthCode : 544889
HostRefNum : 034910000320
ProcReturnCode : “ 00”
TransId : 103491153310910033
mdStatus : “1”
```

# Temel Entegrasyonlar

## HTTP Gönderimi İle Entegrasyon

```
Geçerli bir sipariş parametresi HTTP form ile gizli parametre olarak Nestpay' e
gönderilir. Zorunlu parametrelerine üye iş yeri ek olarak sipariş faturası / teslimatı
ve sipariş edilen ürününün detaylarını Nestpay' e gönderebilir sonrasında gönderilen
bu bilgiler üye iş yeri yönetim ekranından görülebilir. İsteğe bağlı olan
parametrelerin açıklamaları için Ek A. ya bakınız.
.
```
#### HTTP Formunda Zorunlu ve İsteğe Bağlı Parametrelere Örnek

```
<form method="post" action="https://host/fim/Nestpaygate">
<input type="hidden" name="clientid" value="990000000000001"/>
<input type="hidden" name="storetype" value="3d_pay" />
<input type="hidden" name="hash" value="iej6cPOjDd4IKqXWQEznXWqLzLI=" />
<input type="hidden" name="islemtipi" value="Auth" />
<input type="hidden" name="amount" value="91.96" />
<input type="hidden" name="currency" value="949" />
<input type="hidden" name="oid" value="1291899411421" />
<input type="hidden" name="okUrl" value="https://www.teststore.com/success.php" />
<input type="hidden" name="failUrl" value="https://www.teststore.com/fail.php" />
<input type="hidden" name="lang" value="tr" />
<input type="hidden" name="rnd" value="asdf" />
<input type="hidden" input name="pan" value="4242424242424242">
<input type="hidden" input name="Ecom_Payment_Card_ExpDate_Year" value="28" >
<input type="hidden" input name="Ecom_Payment_Card_ExpDate_Month" value="10">
</form>
```

**İsteğe bağlı Fatura bilgi parametreleri:**
<input type="hidden" name="tel" value="012345678"> <input
type="hidden" name="Email" value="test@test.com">
<input type="hidden" name="firmaadi" value="Benim Firmam">
<input type="hidden" name="Faturafirma" value="John Smith">
<input type="hidden" name="Fadres" value="Adres Satırı 1">
<input type="hidden" name="Fadres2" value="Adres Satırı 2">
<input type="hidden" name="Filce" value="Sarıyer">
<input type="hidden" name="Fil" value="İstanbul"> <input
type="hidden" name="Fpostakodu" value="34000"> <input
type="hidden" name="Fulkekodu" value="90">
**İsteğe bağlı Teslimat bilgi parametreleri:**
<input type="hidden" name="NakliyeFirma" value="Teslimat
Firması"> <input type="hidden" name="tismi" value="Berk Smith">
<input type="hidden" name="tadres" value="Adres Satırı 1">
<input type="hidden" name="tadres2" value="Adres Satırı
2"> <input type="hidden" name="tilce" value="Sarıyer">
<input type="hidden" name="til" value="İstanbul"> <input
type="hidden" name="tpostakodu" value="34000"> <input
type="hidden" name="tulkekod" value="90">
**İsteğe bağlı sipariş verilen ürün bilgi parametreleri:**
<input type="hidden" name="ItemNumber1" value="1.ürün numarası">
<input type="hidden" name="ProductCode1" value="1.ürün üretim
kodu"> <input type="hidden" name="Qty1" value="1.ürün miktarı (örn:
3)"> <input type="hidden" name="Desc1" value="1.ürün açıklaması">
<input type="hidden" name="Id1" value="1.ürün Id">
<input type="hidden" name="Price1" value="6.25">
<input type="hidden" name="Total1" value="7.50">


#### Kart İşlemleri

```
Kart bilgileri onaylandıktan sonra müşteri ile 3D doğrulama akışı başlar. 3D
doğrulama süreci tamamlandıktan sonra MPI yanıt parametreleri ve üye iş yeri
tarafından gönderilmiş olan tüm parametreler ödeme yapabilmesi için yine üye iş
yerine geri gönderilir. mdStatus alanında 3D güvenli işlem durum kodu görüldüğünde
ödeme tamamlanmış olur.
MPI yanıt Parametreleri
mdStatus: 3D işlem durum kodu
txstatus: Arşiv için 3D durumu
eci: Elektronik Ticaret Göstergesi (Electronic Commerce Indicator)
cavv: Kart güvenlik numarası (Cardholder Authentication Verification
Value, ACS tarafından belirlenir.)
md : Kart numarası yerine Hash
mdErrorMsg : MPI hata mesajları
Olası mdStatus Değerleri
```
-^ 1 = Doğrulanmış İşlem (Full 3D)^
-^ 2, 3, 4 = Kart kayıtlı değil (Half 3D)^
-^ 5, 6, 7, 8 = Geçerli doğrulama yok veya sistem hatası^
    - 0 = Doğrulama Başarısız
**Başarılı İşlem**
Doğrulama kodu görüntülenir. Sayfanın yenileme süresi bitince müşteri üye iş yerinin
İşlem yanıt parametreleri ile birlikte tüm giriş parametreleri okUrl sayfasına gönderilir.
sayfasına yönlendirilir. İşlem yanıt parametreleri ile birlikte tüm giriş parametreleri **okUrl**
sayfasına gönderilir. Yanıt parametresi: " **Approved** " olarak görülür.
**Başarısız İşlem**
Başarısız mesajı görüntülenir. Sayfanın yenileme süresi bitince müşteri üye iş
yerinin **failUrl** sayfasına yönlendirilir. İşlem yanıt parametreleri ile birlikte tüm giriş
parametreleri **failUrl** sayfasına gönderilir. Yanıt parametresi: " **Decline** " veya
" **Error** " olarak görülür.


**İşlem Yanıt Parametreleri
Response** : "Approved", “Declined” or “Error” (Yanıt Parametresi)
**AuthCode** : İşlem için doğrulama kodu
**HostRefNum** : Banka referans numarası
**ProcReturnCode** : İşlem durum kodu
**TransId** : İşlem numarası
**ErrMsg** : Hata mesajı (Eğer Yanıt “Declined” or “Error” gelir ise bu mesaj alınır.)
**ClientIp** : Müşterinin IP adresi
**ReturnOid** : Dönüş sipariş numarası, giren sipariş numarası ile aynı
olmak zorundadır.
**MaskedPan** : Maskelenmiş kredi kartı numarası
**PaymentMethod** : İşlemin ödeme metodu
**rnd** : Hash karşılaştırması için kullanılacak rastgele dizedir.
**HASHPARAMS** : Hash hesaplaması için kullanılan alan adlarını içerir. Alan
adları ":" karakteri ile eklenir.
**HASHPARAMSVAL** : Hash hesaplaması için eklenen hash alan değerlerini
içerir. Alan değerleri HASHPARAMS alanında aynı sırayla eklenir.
**HASH** : HASHPARAMSVAL ve müşteri şifre alanları için Hash değeri.
**MPI yanıt Parametreleri
mdStatus:** 3D işlem durum kodu
**txstatus:** Arşiv için 3D durumu
**eci:** Elektronik Ticaret Göstergesi (Electronic Commerce Indicator)
**cavv:** Kart güvenlik numarası (Cardholder Authentication Verification
Value, ACS tarafından belirlenir.)
**mdErrorMsg** : MPI hata mesajları
**xid:** Benzersiz internet işlem numarası


**Olası İşlem Sonuçları**

- **Yanıt:** “Approved” (Onaylanan)
    ProcReturnCode "00" olur. Bu, işlemin doğrulanmış olduğunu gösterir.
- **Yanıt:** “Declined” (Reddedilen)
    ProcReturnCode "00" ve "99" dan başka, sanal POS sağlayan banka 2
    basamaklı farklı bir sayı ile hata kodu alır. Bu mesajda sanal POS sağlayan
    bankanın işleme onay vermediği anlaşılır. ErrMsg parametreleri hatanın detay
    açıklamalarını verir. Sanal POS sağlayan bankadan gelen hata kodlarının
    detaylı açıklamalarında Ek B.' deki ProcReturnCode' a bakınız.
- **Yanıt:** “Error” (Hata)
ProcReturnCode "99" alır. bu mesajda; işlemin sanal POS sağlayan bankanın doğrulama
adımında takıldığını gösterir. ErrMsg parametreleri hatanın detaylı açıklamasını verir.


### Hash Kontrolü

```
Üye iş yeri parametreleri aldıktan sonra, parametreleri doğrulamak için üye iş yeri
sunucusunda bir Hash kontrol edilmelidir. Hash kontrolünü sağlamak için mesaj
sadece Nestpay'den gönderilir.
```
#### Hash için Plain Text Oluşturma

```
Hash hesaplamasında kullanılan parametreler şöyledir: clientid, oid, AuthCode,
ProcReturnCode, Response, rnd, md, eci, cavv, mdStatus.
İşlemin tipine göre aşağıdaki parametrelerin bir alt kümesi hash nesil olarak
dahil edilecektir:
```
- 3D olmayan kart işlemleri
_clientid, oid, AuthCode, ProcReturnCode, Response, rnd_^
- 3D güvenlikli kart işlemleri
_clientid, oid, AuthCode, ProcReturnCode, Response, mdStatusi eci, cavv ,md, rnd_
Bu parametrelerin yerini tutan tüm değerler aynı sırayla eklenir. Sonuç dizesi
HASHPARAMSVAL parametre değerleri aynı olacaktır. Üye iş yeri şifresi bu dizenin
sonuna nihai bir değer olarak eklenir. Ortaya çıkan hash 'lenmiş metin SHA
algoritmasına göre base64 versiyonu ile kodlanmıştır. Normal şartlar altında
üretilen hash metni Nestpay tarafından yayınlanan HASH parametre değeri ile aynı
olmalıdır. Aksi takdirde üye iş yeri Nestpay destek takımı ile iletişime geçmelidir.
**Örnek:** 3D olmayan kart işlemleri
**İşlemin yanıt parametreleri olduğunu varsayarak:**
clientid, oid, AuthCode, ProcReturnCode, Response, rnd
**HASHPARAMSVAL:** 990000000000001129189941142132165400Approvedasdf
**HASHPARAMS:** clientid:oid:ProcReturnCode:Response:rnd:
**HASH: CVJssbkrhIzqZXVTwGobciDZI+A=**
Üye iş yeri hash metni; clientid, oid, ProcReturnCode, Response, rnd (ve üye iş yerinin
gizli hash elementinin storekey'i) ile oluşturulur. Varsayalım storekey 123456 olsun
hash metni aşağıdaki gibi oluşur:
990000000000001129189941142132165400Approvedasdf **123456**
Ve üye iş yeri hash metni based64 versiyonuna göre kodlanmıştır (SHA1(plain)). Ortaya
çıkan hash, HASH parametresinin dönüşündeki hash değeri ile aynı olmalıdır.
**Not:** Üye iş yeri, bankadan HASHPARAMS & HASHPARAMSVAL & Odeme
sonucunda dönen HASH'i kendi tarafında kontrol etmelidir.


# Kod Örnekleri

```
3D Pay Hosting modeli alanları için süreçleri izleyiniz. Değerler test amaçlı
eklenmiştir. 3D Pay Hosting modeli örnek kodlar içine eklenmiştir. Üye iş yerleri,
hesap değişikliklerini dikkate alarak değerleri tanımlamalıdır. Bu kodlar referans
olması açısından oluşturulmuştur.
```
## ASP Kod Örnekleri

#### Gönderilen Kod Örneği

```
<html>
<head>
<title>3D PAY</title>
<meta http-equiv="Content-Language" content="tr">
<meta http-equiv="Content-Type" content="text/html; charset=ISO- 8859 - 9">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires"
content="now"> </head>
<body>
<center>
<form method="post" action="https://<host_address>/<3dgate_path>">
<table>
<tr>
<td>Credit Card Number</td>
<td><input type="text" name="pan" size="20"/>
</tr>
<tr>
<td>CVV</td>
<td><input type="text" name="cv2" size="4" value=""/></td>
</tr>
<tr>
<td>Expiration Date Year</td>
<td><input type="text"
name="Ecom_Payment_Card_ExpDate_Year"value=""/> </td>
</tr>
<tr>
<td>Expiration Date Month</td>
<td><input type="text"
name="Ecom_Payment_Card_ExpDate_Month"value=""/> </td>
</tr>
```

<tr>
<td>Choosing Visa Master Card</td>
<td><select name="cardType">
<option value="1">Visa</option>
<option value="2">MasterCard</option>
</select>
</tr>
<tr>
<td align="center" colspan="2">
<input type="submit" value="Complete
Payment"/> </td>
</tr>
</table>
<input type="hidden" name="clientid" value="<%=clientId %>">
<input type="hidden" name="amount" value="<%=amount%>"> <input
type="hidden" name="oid" value="<%=oid%>">
<input type="hidden" name="okUrl" value="<%=okUrl%>">
<input type="hidden" name="failUrl" value="<%=failUrl%>">
<input type="hidden" name="rnd" value="<%=rnd%>" >
<input type="hidden" name="islemtipi" value="<%=islemtipi%>" >
<input type="hidden" name="taksit" value="<%=taksit%>" >
<input type="hidden" name="hash" value="<%=hash%>" >
<input type="hidden" name="storetype" value="3d_pay" >
<input type="hidden" name="lang" value="tr">
<input type="hidden" name="currency" value="949">
<input type="hidden" name="firmaadi" value="My Company
Name"> <input type="hidden" name="Fismi" value="is">
<input type="hidden" name="faturaFirma" value="faturaFirma">
<input type="hidden" name="Fadres" value="XXX">
<input type="hidden" name="Fadres2" value="XXX">
<input type="hidden" name="Fil" value="XXX">
<input type="hidden" name="Filce" value="XXX">
<input type="hidden" name="Fpostakodu" value="postakod93013">
<input type="hidden" name="tel" value="XXX">
<input type="hidden" name="fulkekod" value="tr">
<input type="hidden" name="nakliyeFirma" value="na
fi"> <input type="hidden" name="tismi" value="XXX">
<input type="hidden" name="tadres" value="XXX">
<input type="hidden" name="tadres2" value="XXX">
<input type="hidden" name="til" value="XXX">
<input type="hidden" name="tilce" value="XXX">
<input type="hidden" name="tpostakodu" value="ttt postakod93013">
<input type="hidden" name="tulkekod" value="usa">


<input type="hidden" name="itemnumber1" value="a1">
<input type="hidden" name="productcode1" value="a2">
<input type="hidden" name="qty1" value="3">
<input type="hidden" name="desc1" value="a4 desc">
<input type="hidden" name="id1" value="a5"> <input
type="hidden" name="price1" value="6.25"> <input
type="hidden" name="total1" value="7.50">
</form>
</center>
</body>
</html>

#### Dönüş Kod Örneği

```
<html>
<head>
<title>3D Pay Payment Page</title>
<meta http-equiv="Content-Language" content="tr">
<meta http-equiv="Content-Type" content="text/html; charset=ISO- 8859 -
9"> <meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="now">
</head>
<body>
<!-- #include file = "hex_sha1_js.asp" -->
<h1>Ödeme Sayfasi</h1>
<h3> Payment Response</h3>
<table border="1">
<tr>
<td><b>Parameter Name</b></td>
<td><b>Parameter Value</b></td>
</tr>
dim
obj,ok,mdstatus,hashparams,hashparamsval,hash,index1,index2,storekey,hashparam,val
,hashval,paramsval
dim odemeparametreleri(5)
ok = 1
```

**'hash checking parameters**
storekey = "xxxxxx"
index1 = 1
index2 = 1
hashparams = request.form("HASHPARAMS")
hashparamsval = request.form("HASHPARAMSVAL")
hashparam = request.form("HASH")
paramsval = "" odemeparametreleri(0) =
"AuthCode" odemeparametreleri(1) =
"Response" odemeparametreleri(2) =
"HostRefNum"
odemeparametreleri(3) = "ProcReturnCode"
odemeparametreleri(4) = "TransId"
odemeparametreleri(5) = "ErrMsg"
for each obj in request.form
ok = 1
for each item in odemeparametreleri
if(item = obj) Then
ok = 0
exit for
end if
next
if ok = 1 then
response.write("<tr><td>"&obj & "</td><td>" & request.form(obj) & "</td></tr>")
end if
next
</table>
<br>
<br>
**'hash cheking**
while index1 < Len(hashparams)
index2 = InStr(index1,hashparams,":")
xvalx = Mid(hashparams,index1,index2 - index1)
val = request.form(xvalx)
if val = null then
val = ""
end if
paramsval = paramsval & val
index1 = index2 + 1


Wend
hashval = paramsval & storekey
hash = b64_sha1(hashval)
'response.write("hash=" & hash & "<br/>hashparam=" & hashparam &"<br>paramsval=" &
paramsval &"<br>hashparamsval=" & hashparamsval )
if hash <> hashparam or paramsval <> hashparamsval then
response.write("<h4>Security Alert. The digital signature is not valid.</h4>")
end if
mdstatus = Request.Form("mdStatus")
if mdstatus = 1 or mdstatus = 2 or mdstatus = 3 or mdstatus = 4 Then
<h5>3D Transaction is Success</h5><br/>
<h3> Payment Host</h3>
<table border="1">
<tr>
<td><b>Parameter Name</b></td>
<td><b>Parameter Value</b></td>
</tr>
for each item in odemeparametreleri
response.Write("<tr><td>" & item &"</td><td>" & request.form(item) & "</td></tr>")
next
</table>
if "Approved" = request.form("Response") Then
Response.write("<h6>Transaction is Success</h6>")
Else
Response.write("<h6>Transaction is not Success</h6>")
end if
else
Response.Write("<h6>3D not Approved </h6>")
end if
</body>
</html>


### .Net Kod Örnekleri

#### Gönderilen Kod Örneği

```
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
<title>3D
Pay</title> </head>
<body>
String clientId =
"XXXXXXXXX"; String amount =
"9.95"; String oid = "";
String okUrl = "http://<host_address>/odemesayfasi3dpay.aspx";
String failUrl = "http://<host_address>/odemesayfasi3dpay.aspx";
String rnd = DateTime.Now.ToString();
String taksit = "";
String islemtipi = "Auth";
String storekey="xxxxxx";
String hashstr = clientId + oid + amount + okUrl + failUrl + islemtipi
+ taksit + rnd + storekey;
System.Security.Cryptography.SHA1 sha = new
System.Security.Cryptography.SHA1CryptoServiceProvider();
byte[] hashbytes = System.Text.Encoding.GetEncoding("ISO- 8859 -
9").GetBytes(hashstr);
byte[] inputbytes = sha.ComputeHash(hashbytes);
String hash = Convert.ToBase64String(inputbytes);
<center>
<form method="post" action="https://<host_address>/<3dgate_path>">
<table>
<tr>
<td>Credit Card Number</td>
<td><input type="text" name="pan"
size="20"/> </tr>
<tr>
<td>CVV</td>
<td><input type="text" name="cv2" size="4"
value=""/></td> </tr>
<tr>
<td>Expiration Date Year</td>
<td><input type="text"
name="Ecom_Payment_Card_ExpDate_Year" value=""/></td>
```

</tr>
<tr>
<td>Expiration Date Month</td>
<td><input type="text" name="Ecom_Payment_Card_ExpDate_Month"
value=""/></td>
</tr>
<tr>
<td>Choosing Visa Master Card</td>
<td><select name="cardType">
<option value="1">Visa</option>
<option value="2">MasterCard</option>
</select>
</tr>
<tr>
<td align="center" colspan="2">
<input type="submit" value="Complete Payment"/>
</td>
</tr>
</table>
<input type="hidden" name="clientid" value="<%=clientId%>">
<input type="hidden" name="amount" value="<%=amount%>"> <input
type="hidden" name="oid" value="<%=oid%>">
<input type="hidden" name="okUrl" value="<%=okUrl%>"> <input
type="hidden" name="failUrl" value="<%=failUrl%>"> <input
type="hidden" name="rnd" value="<%=rnd%>" > <input
type="hidden" name="hash" value="<%=hash%>" >
<input type="hidden" name="islemtipi" value="<%=islemtipi %>"
/> <input type="hidden" name="taksit" value="<%=taksit %>" />
<input type="hidden" name="storetype" value="3d_pay" >
<input type="hidden" name="lang" value="tr"> <input
type="hidden" name="currency" value="949">
<input type="hidden" name="firmaadi" value="My Company
Name"> <input type="hidden" name="Fismi" value="is">
<input type="hidden" name="faturaFirma" value="faturaFirma">
<input type="hidden" name="Fadres" value="XXX">
<input type="hidden" name="Fadres2" value="XXX">
<input type="hidden" name="Fil" value="XXX">
<input type="hidden" name="Filce" value="XXX">
<input type="hidden" name="Fpostakodu" value="postakod93013">
<input type="hidden" name="tel" value="XXX">
<input type="hidden" name="fulkekod" value="tr">
<input type="hidden" name="nakliyeFirma" value="na
fi"> <input type="hidden" name="tismi" value="XXX">
<input type="hidden" name="tadres" value="XXX">


```
<input type="hidden" name="tadres2" value="XXX">
<input type="hidden" name="til" value="XXX">
<input type="hidden" name="tilce" value="XXX">
<input type="hidden" name="tpostakodu" value="ttt postakod93013">
<input type="hidden" name="tulkekod" value="usa">
<input type="hidden" name="itemnumber1" value="a1">
<input type="hidden" name="productcode1" value="a2">
<input type="hidden" name="qty1" value="3">
<input type="hidden" name="desc1" value="a4 desc">
<input type="hidden" name="id1" value="a5"> <input
type="hidden" name="price1" value="6.25"> <input
type="hidden" name="total1" value="7.50">
</form>
</center>
</body>
</html>
```
#### Response Code Sample

Code samples write on here....
<html xmlns="http://www.w3.org/1999/xhtml"
> <head runat="server">
<title>3d Pay Payment
Page</title> </head>
<body>
<h1>3D Payment Page</h1>
<h3> Payment Response</h3>
<table border="1">
<tr>
<td><b>Parameter Name</b></td>
<td><b>Parameter Value</b></td>
</tr>
<%
String[] odemeparametreleri = new String[] { "AuthCode", "Response",
"HostRefNum", "ProcReturnCode", "TransId", "ErrMsg" };
IEnumerator e = Request.Form.GetEnumerator();
while (e.MoveNext())
{
String xkey = (String)e.Current;
String xval = Request.Form.Get(xkey);
bool ok = true;
for (int i = 0; i < odemeparametreleri.Length; i++)
{
if (xkey.Equals(odemeparametreleri[i]))
{
ok = false;


break;
}
}
if(ok)
Response.Write("<tr><td>" +xkey +"</td><td>"+ xval+"</td></tr>");
}
</table>
String hashparams = Request.Form.Get("HASHPARAMS");
String hashparamsval = Request.Form.Get("HASHPARAMSVAL");
String storekey = "xxxxxx";
String paramsval = "";
int index1 = 0, index2 = 0;
do
{
index2 = hashparams.IndexOf(":", index1);
String val = Request.Form.Get(hashparams.Substring(index1, index2-index1)) ==
null? "" : Request.Form.Get(hashparams.Substring(index1, index2-index1));
paramsval += val;
index1 = index2 + 1;
}
while (index1 < hashparams.Length);
//out.println("hashparams="+hashparams+"<br/>");
//out.println("hashparamsval="+hashparamsval+"<br/>");
//out.println("paramsval="+paramsval+"<br/>");
String hashval = paramsval + storekey;
String hashparam = Request.Form.Get("HASH");
System.Security.Cryptography.SHA1 sha = new
System.Security.Cryptography.SHA1CryptoServiceProvider();
byte[] hashbytes = System.Text.Encoding.GetEncoding("ISO- 8859 -
9").GetBytes(hashval);
byte[] inputbytes = sha.ComputeHash(hashbytes);
String hash = Convert.ToBase64String(inputbytes);
if (!paramsval.Equals(hashparamsval) || !hash.Equals(hashparam))
{
Response.Write("<h4>Security Alert. The digital signature is not valid.</h4>");
}
String mdStatus = Request.Form.Get("mdStatus");
if(mdStatus.Equals("1") || mdStatus.Equals("2") || mdStatus.Equals("3") ||


mdStatus.Equals("4"))
{
<h5>3D Transaction is Success</h5><br/>
<h3> Payment Response</h3>
<table border="1">
<tr>
<td><b>Parameter Name</b></td>
<td><b>Parameter Value</b></td>
</tr>
for(int i=0;i<odemeparametreleri.Length;i++)
{
String paramname = odemeparametreleri[i]; String
paramval = Request.Form.Get(paramname);
Response.Write("<tr><td>"+paramname+"</td><td>"+paramval+"</td></tr>");
}
</table>
if("Approved".Equals(Request.Form.Get("Response")))
{
<h6>Transaction is Success</h6>
}else
{
<h6>Transaction is not Success</h6>
}
}else{
<h5>3D Transaction is not Success</h5>
}
</body>
</html>


### JSP Kod Örnekleri

#### Gönderilen Kod Örneği

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO- 8859 - 9">
<title>3D Pay</title>
</head>
<body>
String clientId =
"XXXXXXXX"; String amount =
"9.95"; String oid = "";
String okUrl = "http://<store_host_address>/3dpay/odemesayfasi.jsp";
String failUrl = "http://<store_host_address>/3dpay/odemesayfasi.jsp";
String rnd = new java.util.Date().toString();
String taksit = ""; String
islemtipi = "Auth"; String
storekey="xxxxxx";
String hashstr = clientId + oid + amount + okUrl + failUrl +islemtipi +taksit +
rnd + storekey;
java.security.MessageDigest sha1 =java.security.MessageDigest.getInstance("SHA-1");
String hash = (newsun.misc.BASE64Encoder()).encode(sha1.digest(hashstr.getBytes()));
String description = "";
String xid = "";
String email="";
String userid="";
<center>
<form method="post" action="https://<host_address>/<3dgate_path>">
<table>
<tr>
<td>Credit Card Number</td>
<td><input type="text" name="pan" size="20"/>
</tr>
<tr>
<td>CVV</td>
<td><input type="text" name="cv2" size="4" value=""/></td>
</tr>
<tr>
<td>Expiration Date Year</td>
<td><input type="text" name="Ecom_Payment_Card_ExpDate_Year"value=""/></td>
</tr>
<tr>
<td>Expiration Date Month</td>


<td><input type="text"
name="Ecom_Payment_Card_ExpDate_Month"value=""/></td> </tr>
<tr>
<td>Choosing Visa Master Card</td>
<td><select name="cardType">
<option value="1">Visa</option>
<option value="2">MasterCard</option>
</select>
</tr>
<tr>
<td align="center" colspan="2">
<input type="submit" value="Complete
Payment"/> </td>
</tr>
</table>
<input type="hidden" name="clientid" value="<%=clientId%>">
<input type="hidden" name="amount" value="<%=amount%>">
<input type="hidden" name="oid" value="<%=oid%>">
<input type="hidden" name="okUrl" value="<%=okUrl%>">
<input type="hidden" name="failUrl" value="<%=failUrl%>">
<input type="hidden" name="rnd" value="<%=rnd%>" >
<input type="hidden" name="hash" value="<%=hash%>" >
<input type="hidden" name="islemtipi" value="<%=islemtipi%>" >
<input type="hidden" name="taksit" value="<%=taksit%>">
<input type="hidden" name="storetype" value="3d_pay" >
<input type="hidden" name="lang" value="tr">
<input type="hidden" name="currency" value="949">
<input type="hidden" name="firmaadi" value="My Company Name">
<input type="hidden" name="Fismi" value="is">
<input type="hidden" name="faturaFirma" value="faturaFirma">
<input type="hidden" name="Fadres" value="XXX">
<input type="hidden" name="Fadres2" value="XXX">
<input type="hidden" name="Fil" value="XXX">
<input type="hidden" name="Filce" value="XXX">
<input type="hidden" name="Fpostakodu" value="postakod93013">
<input type="hidden" name="tel" value="XXX">
<input type="hidden" name="fulkekod" value="tr">
<input type="hidden" name="nakliyeFirma" value="na
fi"> <input type="hidden" name="tismi" value="XXX">
<input type="hidden" name="tadres" value="XXX">
<input type="hidden" name="tadres2" value="XXX">
<input type="hidden" name="til" value="XXX">
<input type="hidden" name="tilce" value="XXX">
<input type="hidden" name="tpostakodu" value="ttt postakod93013">
<input type="hidden" name="tulkekod" value="usa">


```
<input type="hidden" name="itemnumber1" value="a1">
<input type="hidden" name="productcode1" value="a2">
<input type="hidden" name="qty1" value="3">
<input type="hidden" name="desc1" value="a4 desc">
<input type="hidden" name="id1" value="a5"> <input
type="hidden" name="price1" value="6.25"> <input
type="hidden" name="total1" value="7.50">
</form>
</center>
</body>
</html>
```
#### Dönüş Kod Örneği

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO- 8859 - 9">
<title>3d Pay Payment Page</title>
</head>
<body>
<h1>Payment Page</h1>
<h3> Payment Response</h3>
<table border="1">
<tr>
<td><b>Parameter Name</b></td>
<td><b>Parameter Value</b></td>
</tr>
<%
String [] odemeparametreleri = new String[
{"AuthCode","Response","HostRefNum","ProcReturnCode","TransId","ErrMsg"};
java.util.Enumeration enu = request.getParameterNames();
while(enu.hasMoreElements())
{
String param = (String)enu.nextElement();
String val = (String)request.getParameter(param);
boolean ok = true;
for(int i=0;i<odemeparametreleri.length;i++)
{
if(param.equalsIgnoreCase(odemeparametreleri[i]))
{
ok = false;
break;
}


##### }

if(ok)
out.println("<tr><td>"+param+"</td>"+"<td>"+val+"</td></tr>");
}
</table>
<br>
String hashparams = request.getParameter("HASHPARAMS");
String hashparamsval = request.getParameter("HASHPARAMSVAL");
String storekey="xxxxxx";
String paramsval="";
int index1=0,index2=0;
{
index2 = hashparams.indexOf(":",index1);
String val = request.getParameter(hashparams.substring(index1,index2)) == null? "" :
request.getParameter(hashparams.substring(index1,index2));
paramsval += val;
index1 = index2 + 1;
}
while(index1<hashparams.length());
//out.println("hashparams="+hashparams+"<br/>");
//out.println("hashparamsval="+hashparamsval+"<br/>");
//out.println("paramsval="+paramsval+"<br/>") ; String
hashval = paramsval + storekey;
String hashparam = request.getParameter("HASH");
java.security.MessageDigest sha1 = java.security.MessageDigest.getInstance("SHA-1");
String hash = (new sun.misc.BASE64Encoder()).encode(sha1.digest(hashval.getBytes()));
//out.println("gelen hash="+hashparam+"<br/>");
//out.println("oluşturulan hash="+hash+"<br/>");
String mdStatus = request.getParameter("mdStatus"); if(mdStatus!=null
&& (mdStatus.equals("1") || mdStatus.equals("2")
mdStatus.equals("3")|| mdStatus.equals("4")))
{
<h5>3D Transaction is Success</h5><br/>
<h3>Payment Response</h3>
<table border="1">
<tr>
<td><b>Parameter Name</b></td>
<td><b>Parameter Value</b></td>
</tr>
for(int i=0;i<odemeparametreleri.length;i++)
{
String paramname = odemeparametreleri[i];
String paramval = request.getParameter(paramname);


out.println("<tr><td>"+paramname+"</td><td>"+paramval+"</td></tr>");
}
</table>
if("Approved".equalsIgnoreCase(request.getParameter("Response")))
{
<h6>Transaction is Success</h6><%
}
else
{
<h6>Transaction is not Success</h6>
}
}
else
{
<h5>3D Transaction is not Success</h5>
}
if(!paramsval.equals(hashparamsval)|| !hash.equals(hashparam))
{
out.println("<h4>Security Alert. The digital signature is not valid.</h4>");
}
</body>
</html>


### PHP Kod Örnekleri

#### Gönderilen Kod Örneği

<html>
<head>
<title>3D PAY</title>
<meta http-equiv="Content-Language" content="tr">
<meta http-equiv="Content-Type" content="text/html; charset=ISO- 8859 -
9"> <meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires"
content="now"> </head>
<body>
<?php
$clientId = "XXXXXXXX";
$amount = "9.95";
$oid = "";
$okUrl = "http://<host_address>/3DPayOdeme.php";
$failUrl = "http://<host_address>/3DPayOdeme.php";
$rnd = microtime();
$taksit = "";
$islemtipi="Auth";
$storekey = "xxxxxx";
$hashstr = $clientId. $oid. $amount. $okUrl. $failUrl .$islemtipi. $taksit .$rnd.
$storekey;
$hash =
base64_encode(pack('H*',sha1($hashstr))); ?>
<center>
<form method="post" action="https://<host_address>/<3dgate_path>">
<table>
<tr>
<td>Credit Card Number</td>
<td><input type="text" name="pan" size="20"/>
</tr>
<tr>
<td>CVV</td>
<td><input type="text" name="cv2" size="4" value=""/></td>
</tr>
<tr>
<td>Expiration Date Year</td>
<td><input type="text" name="Ecom_Payment_Card_ExpDate_Year"
value=""/></td> </tr>
<tr>
<td>Expiration Date Month</td>


<td><input type="text" name="Ecom_Payment_Card_ExpDate_Month"
value=""/></td> </tr>
<tr>
<td>Choosing Visa Master Card</td>
<td><select name="cardType">
<option value="1">Visa</option>
<option value="2">MasterCard</option>
</select>
</tr>
<tr>
<td align="center" colspan="2">
<input type="submit" value="Complete
Payment"/> </td>
</tr>
</table>
<input type="hidden" name="clientid" value="<?php echo $clientId ?>">
<input type="hidden" name="amount" value="<?php echo $amount ?>">
<input type="hidden" name="oid" value="<?php echo $oid ?>">
<input type="hidden" name="okUrl" value="<?php echo $okUrl ?>">
<input type="hidden" name="failUrl" value="<?php echo $failUrl ?>">
<input type="hidden" name="rnd" value="<?php echo $rnd ?>" >
<input type="hidden" name="hash" value="<?php echo $hash ?>" >
<input type="hidden" name="islemtipi" value="<?php echo $islemtipi ?>" >
<input type="hidden" name="taksit" value="<?php echo $taksit ?>" >
<input type="hidden" name="storetype" value="3d_pay" >
<input type="hidden" name="lang" value="tr">
<input type="hidden" name="currency" value="949">
<input type="hidden" name="firmaadi" value="My Company
Name"> <input type="hidden" name="Fismi" value="is">
<input type="hidden" name="faturaFirma" value="faturaFirma">
<input type="hidden" name="Fadres" value="XXX">
<input type="hidden" name="Fadres2" value="XXX">
<input type="hidden" name="Fil" value="XXX">
<input type="hidden" name="Filce" value="XXX">
<input type="hidden" name="Fpostakodu" value="postakod93013">
<input type="hidden" name="tel" value="XXX">
<input type="hidden" name="fulkekod" value="tr">
<input type="hidden" name="nakliyeFirma" value="na
fi"> <input type="hidden" name="tismi" value="XXX">
<input type="hidden" name="tadres" value="XXX">
<input type="hidden" name="tadres2" value="XXX">
<input type="hidden" name="til" value="XXX">
<input type="hidden" name="tilce" value="XXX">
<input type="hidden" name="tpostakodu" value="ttt postakod93013">
<input type="hidden" name="tulkekod" value="usa">
<input type="hidden" name="itemnumber1" value="a1">


<input type="hidden" name="productcode1" value="a2">
<input type="hidden" name="qty1" value="3">
<input type="hidden" name="desc1" value="a4 desc">
<input type="hidden" name="id1" value="a5"> <input
type="hidden" name="price1" value="6.25"> <input
type="hidden" name="total1" value="7.50">
</form>
</center>
</body>
</html>

#### Dönüş Kod Örneği

```
<html>
<head>
<title>3D</title>
<meta http-equiv="Content-Language" content="tr">
<meta http-equiv="Content-Type" content="text/html; charset=ISO- 8859 - 9">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="now">
</head>
<body>
<h1>3D Payment Page</h1>
<h3>Payment Response</h3>
<table border="1">
<tr>
<td><b>Parameter Name</b></td>
<td><b>Parameter Value</b></td>
</tr>
<?php
$odemeparametreleri =
array("AuthCode","Response","HostRefNum","ProcReturnCode","TransId","ErrMsg");
foreach($_POST as $key => $value)
{
$check=1;
for($i=0;$i<6;$i++)
{
if($key == $odemeparametreleri[$i])
{
$check=0;
break;
}
}
if($check == 1)
```

##### {

echo "<tr><td>".$key."</td><td>".$value."</td></tr>";
}
}
?>
</table>
<br>
<br>
<?php
$hashparams = $_POST["HASHPARAMS"];
$hashparamsval =
$_POST["HASHPARAMSVAL"]; $hashparam =
$_POST["HASH"]; $storekey="xxxxxx";
$paramsval="";
$index1=0;
$index2=0;
while($index1 < strlen($hashparams))
{
$index2 = strpos($hashparams,":",$index1);
$vl = $_POST[substr($hashparams,$index1,$index2-
$index1)]; if($vl == null)
$vl = "";
$paramsval = $paramsval.
$vl; $index1 = $index2 + 1;
}
$storekey = "xxxxxx";
$hashval = $paramsval.$storekey;
$hash = base64_encode(pack('H*',sha1($hashval)));
if($paramsval != $hashparamsval || $hashparam != $hash)
echo "<h4>Security Alert. The digital signature is not valid.</h4>";
$mdStatus = $_POST["mdStatus"];
$ErrMsg = $_POST["ErrMsg"];
if($mdStatus == 1 || $mdStatus == 2 || $mdStatus == 3 || $mdStatus == 4)
{
echo "<h5>3D Transaction is Success</h5><br/>";
?>
<h3>Payment Response</h3>
<table border="1">
<tr>
<td><b>Parameter Name</b></td>
<td><b>Parameter Value</b></td>
</tr>
<?php


for($i=0;$i<6;$i++)
{
$param = $odemeparametreleri[$i];
echo "<tr><td>".$param."</td><td>".$_POST[$param]."</td></tr>";
}
?>
</table>
<?php
$response = $_POST["Response"];
if($response == "Approved")
{
echo "Ödeme Islemi Basarili";
}
else
{
echo "Transaction is not Success. Error = ".$ErrMsg;
}
}
else
{
echo "<h5>3D Transaction is not Success</h5>";
}
?>
</body>
</html>


# Ek A: Geçit Parametreleri

## Girişi Zorunlu olan Parametreler

**Alan Açıklama Format** (^)
clientid Üye iş yeri numarası Harf ya da rakam, maksimum 15 (^)
karakter (^)
storetype Üye iş yerinin ödeme modeli Olası değerler: "pay_hosting", (^)
“3d_pay_hosting”, "3d" (^)
(^)
islemtipi İşlem Tipi Harf ya da rakam, geçerli değerler (^)
{Auth, PreAuth, PostAuth, Void, (^)
Credit} (^)
amount İşlem tutarı Rakam, (^)
ondalık rakamlar “,” veya “.” ile (^)
ayrılır. (^)
Karakter kullanılmaz. (^)
currency^ ISO para birimi kodu^ Rakam, 3 rakam (TL için 949)^
oid Sipariş numarası Harf ya da rakam, maksimum 64 (^)
karakter (^)
pan^ Kredi Kartı Numarası^ Maksimum 20 rakam^
Ecom_Payment_Card Son kullanma tarihi (yıl) 4 rakam (^)
_ExpDate_Year^
Ecom_Payment_Card Son kullanma tarihi (ay) 2 rakam (^)
_ExpDate_Month^
okUrl Nestpay Ödeme Geçidine gelen başarılı Örnek: (^)
işlem bilgilendirmesini üye iş yeri
[http://www.test.com/basarili.php](http://www.test.com/basarili.php) (^)
(^)
tarafındaki başarılı işlem bildirimi için (^)
(^) önceden belirlenmiş olan URL' e iletilir. (^)
(^)
failUrl Nestpay Ödeme Geçidine gelen başarısız Örnek: (^)
(^) işlem bilgilendirmesini üye iş yeri [http://www.test.com/basarisiz.php](http://www.test.com/basarisiz.php) (^)
(^)
(^) tarafındaki başarısız işlem bildirimi için (^)
(^) önceden belirlenmiş olan URL' e iletilir. (^)
(^)
lang Nestpay ödeme sayfasında kullanılan dil. Türkçe için "tr" , İngilizce için "en" (^)
(^)
rnd Hash karşılaştırması için kullanılacak Sabit uzunluk, 20 karakter (^)
(^) rastgele dizedir. (^)
(^)
hash Kullanıcı doğrulama için Hash değeri (^)
(^)


### Girişi İsteğe Bağlı olan Parametreler

```
Alan Açıklama Format
refreshtime saniyeler içinde yönlendirilmeyi
sağlayan sayaç değeri (okUrl veya
```
(^) failUrl' e yönlendirme süresi) (^)
encoding Gönderilen verinin kodlaması. Maksimum 32 karakter
Gönderilmemiş ise varsayılan değer
"utf-8" dir. (^)
description^ Açıklama^ Maksimum 255 karakter^
taksit
Taksit adedi (Peşin işlemlerde taksit
Parametresi boş gönderilmelidir.) Rakam
Email^ Müşteri e-posta adresi^ Maksimum 64 karakter^
firmaadi^ Faturalama yapılacak firma adı^ Maksimum 255 karakter^
Faturafirma^ Faturalama yapılacak müşteri adı^ Maksimum 255 karakter^
tel^ Faturalama yapılacak telefon numarası^ Maksimum 32 karakter^
Fadres^ Fatura 1. adres satırı^ Maksimum 255 karakter^
Fadres2^ Fatura 2. adres satırı^ Maksimum 255 karakter^
Filce^ Faturalama yapılacak ilçe^ Maksimum 64 karakter^
Fil^ Faturalama yapılacak şehir^ Maksimum 32 karakter^
Fpostakodu^ Faturalama yapılacak posta kodu^ Maksimum 32 karakter^
Fulkekodu^ Faturalama yapılacak ülke kodu^ Maksimum 3 karakter^
NakliyeFirma^ Teslimat yapılacak firma adı^ Maksimum 255 karakter^
tismi^ Teslimat yapılacak müşteri adı^ Maksimum 255 karakter^
tadres^ Teslimat 1. adres satırı^ Maksimum 255 karakter^
tadres2^ Teslimat 2. adres satırı^ Maksimum 255 karakter^
tilce^ Teslimat yapılacak ilçe^ Maksimum 64 karakter^
til^ Teslimat yapılacak şehir^ Maksimum 32 karakter^
tpostakodu^ Teslimat posta kodu^ Maksimum 32 karakter^
tulkekod^ Teslimat yapılacak ülke kodu^ Maksimum 3 karakter^
id1^ 1. ürün Id^ Maksimum 128 karakter^
itemnumber1^ 1. ürün numarası^ Maksimum 128 karakter^
productcode1^ 1. ürün üretim kodu^ Maksimum 64 karakter^
qty1^ 1. ürün miktarı^ Maksimum 32 karakter^
desc1^ 1. ürünün açıklaması^ Maksimum 128 karakter^
price1^ 1. ürün birim fiyatı^ Maksimum 32 karakter^
amount1^ 1. ürün miktarı X 1. ürün birim fiyatı^ Maksimum 32 karakter^


### İşlem Yanıt Parametreleri

**Alan Açıklama Format** (^)
AuthCode İşlem doğrulama / Onaylama / 6 karakter (^)
doğrulama kodu (^)
Response Ödeme durumu Olası değerler: "Approved", "Error", (^)
"Declined" (^)
HostRefNum^ Banka referans kodu^ 12 karakter^
ProcReturnCode İşlem durum kodu 2 basamaklı, (^)
onaylanmış: "00" (^)
Nestpay hatası: "99" (^)
Diğer hatalar: ISO-8583 hata kodları (^)
TransId^ İşlem numarası^ Maksimum 64 karakter^
ErrMsg^ Hata mesajı^ Maksimum 255 karakter^
ClientIp Müşterinin IP adresi Maksimum 15 karakter aşağıdaki şekilde (^)
formatlanmıştır: "###.###.###.###" (^)
ReturnOid Dönen sipariş numarasıdır ve Maksimum 64 karakter (^)
giren sipariş numarası ile aynı (^)
olmak zorundadır. (^)
MaskedPan^ Maskelenmiş kredi kartı numarası^ 12 karakter, örnek: XXXXXX***XXX^
EXTRA.TRXDATE İşlem Tarihi 17 karakter, (^)
"yyyyMMdd HH:mm:ss" (^)
rnd Hash karşılaştırması için Sabit uzunluk, 20 karakter (^)
kullanılacak rastgele dizedir. (^)
(^)
HASHPARAMS Hash hesaplaması için kullanılan Olası değerler (^)
alan adlarını içerir. Alan adları ":"
"clientid:oid:AuthCode:ProcReturnCode:R (^)
(^) esponse:rnd:" for non-3D transactions,
karakteri ile eklenir. "clientId:oid:AuthCode:ProcReturnCode:R (^)
esponse:mdStatus:cavv:eci:md:rnd:" for (^)
3D transactions (^)
HASHPARAMSVAL Hash hesaplaması için eklenen Sabit uzunluk, 28 karakter (^)
hash alan değerlerini içerir. Alan (^)
değerleri HASHPARAMS alanında (^)
aynı sırayla eklenir. (^)
HASH HASHPARAMSVAL ve müşteri şifre Sabit uzunluk, 20 karakter (^)
(^) alanları için Hash değeri. (^)
(^)


### MPI Yanıt Parametreleri

**Alan Açıklama Format** (^)
mdStatus 3D işlem durum kodu 1 = Doğrulanmış İşlem (Full (^)
3D) (^)
(^) 2, 3, 4 = kart kayıtlı değil (^)
(Half 3D) (^)
5, 6, 7, 8 = Geçerli (^)
doğrulama yok veya sistem (^)
hatası (^)
0 = Doğrulama Başarısız (^)
merchantID^ Üye iş yeri numarası (MPI)^ 15 karakter^
txstatus^ 3D status for archival^ olası değerler "A", "N", "Y"^
iReqCode İsteği doğrulamak için verinin düzgün 2 basamaklı, rakam (^)
formatlandığını gösteren ACS tarafından (^)
(^) sağlanan kod. (^)
(^)
iReqDetail Geçersiz İstek Kodunda bazı veri (^)
(^) elemanlarını tanımlayan detay verisi. (^)
(^)
vendorCode iReqDetail hatasını tanımlayan hata (^)
mesajı (^)
(^)
PAResSyntaxOK Eğer PARes doğrulaması sentaktik olarak "Y" veya "N" (^)
doğruysa bu değer doğrudur, aksi (^)
(^) takdirde yanlıştır (^)
(^)
ParesVerified Eğer imza doğrulamasının sonucu "Y" veya "N" (^)
(^) başarılıysa bu değer doğrudur. Eğer (^)
(^) PARes mesajı alınmamışsa ya da imza (^)
(^) doğrulaması başarısız olursa yanlıştır (^)
eci Elektronik Ticaret Göstergesi (Electronic 2 basamaklı, 3D siz işlemlerde boş (^)
Commerce Indicator) (^)
(^)
cavv Kart güvenlik numarası (Cardholder 28 karakter, Base64 ile kodlanmış (^)
Authentication Verification Value, ACS
bir 20 byte değerini içeren 28 byte (^)
(^) sonuç verir.
tarafından belirlenir.) (^)
(^)
xid Benzersiz internet işlem numarası 28 karakter, base64 kodlaması (^)
(^)
cavvAlgorthm^ Kart güvenlik numarası algoritması^ olası değerler "0", "1", "2", "3"^
md^ Kart numarası yerine MPI verisi^ Alpha-nümerik^
Version^ MPI versiyon bilgisi^ 3 karakter (örn: "2.0")^
sID^ Şema numarası^ Visa için"1",Mastercard için "2"^
MdErrorMsg^ Eğer var ise MPI dan gelen hata mesajı^ Maksimum 512 karakter^



