## Version

# 1.

## NestPay

### ®

## Test Dökümanı

```
http://www.asseco-see.com.tr
```

## İNDEKS

### Test Bilgileri Hakkında Önemli Bilgi.........................................................

### 3D Modeline Göre Test Bilgileri ................................................................

### Raporlar Arayüzü için ...............................................................................

### POST Bilgileri ...........................................................................................

### Dönen Değerlerin API Server'a Gönderilmesi ..........................................

### Test Kredi Kartı Bilgileri ............................................................................

### 3D_PAY Modeline Göre Test Bilgileri .......................................................

### Raporlar Arayüzü için ...............................................................................

### POST Bilgileri ...........................................................................................

### Test Kredi Kartı Bilgileri ............................................................................

### 3D_PAY_HOSTING Modeline Göre Test Bilgileri .....................................

### Raporlar Arayüzü için ...............................................................................

### POST Bilgileri ...........................................................................................

### Test Kredi Kartı Bilgileri ............................................................................

### PAY_HOSTING Modeline Göre Test Bilgileri ...........................................

### Raporlar Arayüzü için ...............................................................................

### POST Bilgileri ...........................................................................................

### Test Kredi Kartı Bilgileri ............................................................................

### 3D_HOSTING Modeline Göre Test Bilgileri ..............................................

### Raporlar Arayüzü için ...............................................................................

### POST Bilgileri ...........................................................................................

### Dönen Değerlerin API Server'a Gönderilmesi ..........................................

### Test Kredi Kartı Bilgileri ............................................................................

### 3D'siz Test Bilgileri (Aynı Zamanda 3D'li Mağaza) ..................................

### Raporlar Arabirmi için ...............................................................................

### API Server POST Bilgileri .........................................................................

### Test Kredi Kartı Bilgileri ............................................................................

### Gerçek Ortam Bilgileri ...............................................................................

### Raporlar için .............................................................................................

### POST adresi .............................................................................................

### 3D Modelinde Api Server için ................................................................

### 3D Secure için .......................................................................................

### Desteklenen Para Birimleri .......................................................................

### BİN Numaraları ...........................................................................................


## 1.Test Bilgileri Hakkında Önemli Bilgi

```
Not: Test bilgileri ortak olarak kullanıldığından, lütfen Storekey
değerini değiştirmeyiniz!
Ara yüz ile ilgili bilgi için bk. Nestpay Üye İş Yeri Dokümanı
```
## 2.3D Modeline göre test bilgileri

#### 2.1 Raporlar Arayüzü için

```
Link:https://entegrasyon.asseco-see.com.tr/halk/report/user.login
Mağaza Numarası (Client Id ) 500100000
Kullanıcı Adı : Mail ile tarafımızdan talep ediniz.
Şifre : Mail ile tarafımızdan talep ediniz.
```
#### 2.2 POST Bilgileri

```
Link: https://entegrasyon.asseco-see.com.tr/fim/est3Dgate
Mağaza Numarası (Client Id ) : 500100000
Storekey (Üye İş Yeri Anahtarı) : 123456
Model : 3d
```
#### 2.3 Dönen Değerlerin API Server’a Gönderilmesi

```
Link: https://entegrasyon.asseco-see.com.tr/fim/api
Mağaza Numarası (Client Id ) 500100000
Api Kullanıcı Adı : Mail ile tarafımızdan talep ediniz.
Şifre : Mail ile tarafımızdan talep ediniz.
```
#### 2.4 Test Kredi Kartı Bilgileri

```
Kart Numarası (Visa) : 4531444531442283
Kart Numarası (Master Card) : 5818775818772285
Son Kullanma Tarihi : 12/
Güvenlik Numarası : 001
Kart 3D Secure Şifresi : a
```

## 3.3D_PAY Modeline gore test bilgileri

#### 3.1 Raporlar Arayüzü için

```
Link: https://entegrasyon.asseco-see.com.tr/halk/report/user.login
Mağaza Numarası (Client Id ) 500200000
Kullanıcı Adı : Mail ile tarafımızdan talep ediniz.
Şifre : Mail ile tarafımızdan talep ediniz.
```
#### 3.2 POST Bilgileri

```
Link: https://entegrasyon.asseco-see.com.tr/fim/est3Dgate
Mağaza Numarası (Client Id ) : 500200000
Storekey (Üye İş Yeri Anahtarı) : 123456
Model : 3d_pay
```
#### 3.3 Test Kredi Kartı Bilgileri

```
Kart Numarası (Visa) : 4531444531442283
Kart Numarası (Master Card) : 5818775818772285
Son Kullanma Tarihi : 12/
Güvenlik Numarası : 001
Kart 3D Secure Şifresi : a
```

## 4.3D_PAY_HOSTING Modeline göre test

## bilgileri

#### 4.1 Raporlar Arayüzü için

```
Link: https://entegrasyon.asseco-see.com.tr/halk/report/user.login
Mağaza Numarası (Client Id ) 500300000
Kullanıcı Adı : Mail ile tarafımızdan talep ediniz.
Şifre : Mail ile tarafımızdan talep ediniz.
```
#### 4.2 POST Bilgileri

```
Link: https://entegrasyon.asseco-see.com.tr/fim/est3Dgate
Mağaza Numarası (Client Id ) : 500300000
Storekey (Üye İş Yeri Anahtarı) : 123456
Model : 3d_pay_hosting
```
#### 4.3 Test Kredi Kartı Bilgileri

```
Kart Numarası (Visa) : 4531444531442283
Kart Numarası (Master Card) : 5818775818772285
Son Kullanma Tarihi : 12/
Güvenlik Numarası : 001
Kart 3D Secure Şifresi : a
```

## 5. PAY_HOSTING Modeline göre test bilgileri

```
3D kullanımı olmadan güvenli ödeme sayfasıdır. (SSL Sayfa)
```
#### 5.1 Raporlar Arayüzü için

```
Link: https://entegrasyon.asseco-see.com.tr/halk/report/user.login
Mağaza Numarası (Client Id ) 500400000
Kullanıcı Adı : Mail ile tarafımızdan talep ediniz.
Şifre : Mail ile tarafımızdan talep ediniz.
```
#### 5.2 POST Bilgileri

```
Link: https://entegrasyon.asseco-see.com.tr/fim/est3Dgate
Mağaza Numarası (Client Id ) : 500400000
Storekey (Üye İş Yeri Anahtarı) : 123456
Model : pay_hosting
```
#### 5.3 Test Kredi Kartı Bilgileri

```
Kart Numarası (Visa) : 4531444531442283
Kart Numarası (Master Card) : 5818775818772285
Son Kullanma Tarihi : 12/
Güvenlik Numarası : 001
Kart 3D Secure Şifresi : a
```

## 6.3D_HOSTING Modeline Göre Test Bilgileri

#### 6.1 Raporlar Arayüzü için

```
Link: https://entegrasyon.asseco-see.com.tr/halk/report/user.login
Mağaza Numarası (Client Id ) 500500000
Kullanıcı Adı : Mail ile tarafımızdan talep ediniz.
Şifre : Mail ile tarafımızdan talep ediniz.
```
#### 6.2 POST Bilgileri

```
Link: https://entegrasyon.asseco-see.com.tr/fim/est3Dgate
Mağaza Numarası (Client Id ) : 500500000
Storekey (Üye İş Yeri Anahtarı) : 123456
Model : 3d_hosting
```
#### 6.3 Dönen Değerlerin API Server'a Gönderilmesi

```
Link: https://entegrasyon.asseco-see.com.tr/fim/api
Mağaza Numarası (Client Id ) 500500000
Api Kullanıcı Adı : Mail ile tarafımızdan talep ediniz.
Şifre : Mail ile tarafımızdan talep ediniz.
```
#### 6.4 Test Kredi Kartı Bilgileri

```
Kart Numarası (Visa) : 4531444531442283
Kart Numarası (Master Card) : 5818775818772285
Son Kullanma Tarihi : 12/26
Güvenlik Numarası : 001
Kart 3D Secure Şifresi : a
```

## 7.3D'siz Test Bilgileri ( Aynı zamanda 3D'li Mağaza)

```
Bir Üye İş Yeri Hem 3D'li Hemde 3D'siz çalışabilir.
```
#### 7.1 Raporlar Arayüzü için

```
Link: https://entegrasyon.asseco-see.com.tr/halk/report/user.login
Mağaza Numarası (Client Id ) 500100000
Kullanıcı Adı : Mail ile tarafımızdan talep ediniz.
Şifre : Mail ile tarafımızdan talep ediniz.
```
#### 7.2 API Server POST Bilgileri

```
Link: https://entegrasyon.asseco-see.com.tr/fim/api
Mağaza Numarası (Client Id ) 500100000
Api Kullanıcı Adı : Mail ile tarafımızdan talep ediniz.
Şifre : Mail ile tarafımızdan talep ediniz.
```
#### 7.3 Test Kredi Kartı Bilgileri

Kart Numarası (Visa) : 4531444531442283
Kart Numarası (Master Card) : 5818775818772285
Son Kullanma Tarihi : 12/
Güvenlik Numarası : 001
8 | Halkbank Test Dokumanı


## Gerçek Ortam Bilgileri

#### Raporlar için

```
https://sanalpos.halkbank.com.tr/
```
#### POST adresi

3D Modelinde Api Server için
https://sanalpos.halkbank.com.tr/fim/api
3D Secure için
https://sanalpos.halkbank.com.tr/fim/est3Dgate

## Desteklenen Para Birimleri

```
Kod Para Birmi
```
## 949

## 978

## 840

## TL

## EURO

## USD

9 | Halkbank Test Dokumanı


## BİN Numaraları

**BIN Açıklaması**
415514 VISA PLATIN
492094 VISA GOLD
492095 VISA CLASSIC
498852 VISA BUSINESS
521378 MasterCard PLATIN
540435 MasterCard GOLD
543081 MasterCard CLASSIC
552879 MasterCard BUSINESS
510056 SANAL KART
**BANKA KARTI BIN TABLOSU
BIN Açıklaması**
415515 Visa Electron PLATIN
421030 Visa Electron BUSINESS
440776 Visa Electron CLASSIC
447505 Visa Electron CLASSIC
499821 Visa Electron (Debit-Prepaid)
466260 Visa Electron (Debit-Prepaid)
451454 Visa EMV Debit (Debit-Prepaid)
526289 MasterCard (Debit-Prepaid)
526290 MasterCard (Debit-Prepaid)
588843 MasterCard CLASSIC
676258 MasterCard CLASSIC
639001 MasterCard CLASSIC
10 | Halkbank Test Dokumanı


