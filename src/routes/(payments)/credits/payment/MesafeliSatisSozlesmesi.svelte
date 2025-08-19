<script lang="ts">
	let { form, selectedPackage } = $props();

	function formatTurkishCurrency(value: number): string {
		if (!value) return '';
		return (
			value.toLocaleString('tr-TR', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}) + ' ₺'
		);
	}

	let product = $derived.by(() => {
		let amount = selectedPackage.amount;
		let total = selectedPackage.total;
		let unitPrice = selectedPackage.unitPrice;
		let rawUnitPrice = selectedPackage.unitPrice;
		let totalTax = selectedPackage.total - selectedPackage.total;
		let rawTotal = selectedPackage.total;

		return { amount, total, unitPrice, totalTax, rawTotal, rawUnitPrice };
	});

	/**
	 * Formats a Date object into a "DD.MM.YYYY" string.
	 * @param date The Date object to format. Defaults to the current date if not provided.
	 * @returns The formatted date string.
	 */
	function formatDate(date: Date = new Date()): string {
		// Get the day of the month and add a leading zero if needed
		const day = String(date.getDate()).padStart(2, '0');

		// Get the month (0-indexed) and add a leading zero if needed
		const month = String(date.getMonth() + 1).padStart(2, '0');

		// Get the full year
		const year = date.getFullYear();

		return `${day}.${month}.${year}`;
	}

	// Example Usage:
	const today = formatDate();
</script>

<h1>SATIŞ SÖZLEŞMESİ</h1>

<h2>1.KONU</h2>

<p>
	İşbu Satış Sözleşmesi Ön Bilgi Formu’nun konusu, SATICI' nın, SİPARİŞ VEREN/ALICI' ya satışını
	yaptığı, aşağıda nitelikleri ve satış fiyatı belirtilen ürün/ürünlerin satışı ve teslimi ile
	ilgili olarak 6502 sayılı Tüketicilerin Korunması Hakkındaki Kanun - Mesafeli Sözleşmeler
	Yönetmeliği (RG:27.11.2014/29188) hükümleri gereğince tarafların hak ve yükümlülüklerini
	kapsamaktadır. İş bu ön bilgilendirme formunu kabul etmekle ALICI, sözleşme konusu siparişi
	onayladığı takdirde sipariş konusu bedeli ve varsa kargo ücreti, vergi gibi belirtilen ek
	ücretleri ödeme yükümlülüğü altına gireceğini ve bu konuda bilgilendirildiğini peşinen kabul eder.
</p>

<h2>2. SATICI BİLGİLERİ</h2>

<p><strong>Ünvanı :</strong> ARNİVA YAZILIM İTH. İHR. TİC. A.Ş.</p>
<p>
	<strong>Adresi :</strong> Tepe Mah. Kubilay Alpugan Sok. Tokgöz Apt. K:2 D:6, 48700 Marmaris/Muğla
</p>
<p><strong>Telefon :</strong> 0850 307 80 80</p>
<p><strong>Eposta :</strong> info@arniva.com.tr</p>

<h2>3. ALICI BİLGİLERİ (Bundan sonra ALICI olarak anılacaktır.)</h2>

<p><strong>Adı/Soyadı/Ünvanı :</strong> {form?.data?.unvan || '?'}</p>
<p><strong>Adresi :</strong> {form?.data?.adres || '?'}</p>

<h2>4. SÖZLEŞME KONUSU ÜRÜN/ÜRÜNLER BİLGİLERİ</h2>

<p>
	<strong>4.1</strong> Malın / Ürün/Ürünlerin / Hizmetin temel özellikleri (türü, miktarı, marka/modeli,
	rengi, adedi) SATICI’ya ait internet sitesinde yer almaktadır.
</p>
<p>
	<strong>4.2</strong> Listelenen ve sitede ilan edilen fiyatlar satış fiyatıdır. İlan edilen fiyatlar
	ve vaatler güncelleme yapılana ve değiştirilene kadar geçerlidir. Süreli olarak ilan edilen fiyatlar
	ise belirtilen süre sonuna kadar geçerlidir.
</p>
<p>
	<strong>4.3</strong> Sözleşme konusu mal ya da hizmetin tüm vergiler dâhil satış fiyatı aşağıdaki tabloda
	gösterilmiştir.
</p>

<!-- ---- TABLE GELECEK --- Ürün Adı Fiyat Miktar Tutarı Tht Transistör To-92 4,35 10 Adet 43,53 TL -->

<table class="table table-bordered">
	<thead>
		<tr>
			<th scope="col">Ürün Adı</th>
			<th scope="col">Fiyat</th>
			<th scope="col">Miktar</th>
			<th scope="col">Tutarı</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>E-Arşiv Kontör</td>
			<td>{formatTurkishCurrency(product.rawUnitPrice)}</td>
			<td>{product.amount} Adet</td>
			<td>{formatTurkishCurrency(product.rawTotal)}</td>
		</tr>
	</tbody>
</table>
<hr />
<!-- KDV:177,56 TL KDV dahil toplam alışveriş tutarınız:1.065,35 TL -->
<p><strong>KDV:</strong> {formatTurkishCurrency(product.totalTax)}</p>
<p>
	<strong>KDV dahil toplam alışveriş tutarınız:</strong>
	{formatTurkishCurrency(product.total)}
</p>
<hr />
<h2>5. GENEL HÜKÜMLER</h2>

<p>
	<strong>5.1.</strong> ALICI, SATICI’ya ait internet sitesinde sözleşme konusu ürünün temel nitelikleri,
	satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup, bilgi sahibi olduğunu, elektronik
	ortamda gerekli teyidi verdiğini kabul, beyan ve taahhüt eder. ALICININ; Ön Bilgilendirmeyi elektronik
	ortamda teyit etmesi, mesafeli satış sözleşmesinin kurulmasından evvel, SATICI tarafından ALICI' ya
	verilmesi gereken adresi, siparişi verilen ürünlere ait temel özellikleri, ürünlerin vergiler dâhil
	fiyatını, ödeme ve teslimat bilgilerini de doğru ve eksiksiz olarak edindiğini kabul, beyan ve taahhüt
	eder.
</p>
<p>
	<strong>5.2.</strong> Sözleşme konusu her bir ürün, 30 günlük yasal süreyi aşmamak kaydı ile ALICI'
	nın yerleşim yeri uzaklığına bağlı olarak internet sitesindeki ön bilgiler kısmında belirtilen süre
	zarfında ALICI veya ALICI’ nın gösterdiği adresteki kişi ve/veya kuruluşa teslim edilir. Bu süre içinde
	ürünün ALICI’ya teslim edilememesi durumunda, ALICI’nın sözleşmeyi feshetme hakkı saklıdır.
</p>
<p>
	<strong>5.3.</strong> SATICI, sözleşme konusu ürünü eksiksiz, siparişte belirtilen niteliklere uygun
	ve varsa garanti belgeleri, kullanım kılavuzları ile teslim etmeyi, her türlü ayıptan arî olarak yasal
	mevzuat gereklerine sağlam, standartlara uygun bir şekilde işin gereği olan bilgi ve belgeler ile işi
	doğruluk ve dürüstlük esasları dâhilinde ifa etmeyi, hizmet kalitesini koruyup yükseltmeyi, işin ifası
	sırasında gerekli dikkat ve özeni göstermeyi, ihtiyat ve öngörü ile hareket etmeyi kabul, beyan ve
	taahhüt eder.
</p>
<p>
	<strong>5.4.</strong> SATICI, sözleşmeden doğan ifa yükümlülüğünün süresi dolmadan ALICI’yı bilgilendirmek
	ve açıkça onayını almak suretiyle eşit kalite ve fiyatta farklı bir ürün tedarik edebilir.
</p>
<p>
	<strong>5.5.</strong> SATICI, sipariş konusu ürün veya hizmetin yerine getirilmesinin imkânsızlaşması
	halinde sözleşme konusu yükümlülüklerini yerine getiremezse, bu durumu, öğrendiği tarihten itibaren
	3 gün içinde yazılı olarak tüketiciye bildireceğini, 14 günlük süre içinde toplam bedeli ALICI’ya iade
	edeceğini kabul, beyan ve taahhüt eder.
</p>
<p>
	<strong>5.6.</strong> ALICI, sözleşme konusu ürünün teslimatı için işbu Ön Bilgilendirme Formunu elektronik
	ortamda teyit edeceğini, herhangi bir nedenle sözleşme konusu ürün bedelinin ödenmemesi ve/veya banka
	kayıtlarında iptal edilmesi halinde, SATICI’ nın sözleşme konusu ürünü teslim yükümlülüğünün sona ereceğini
	kabul, beyan ve taahhüt eder.
</p>
<p>
	<strong>5.7.</strong> ALICI, Sözleşme konusu ürünün ALICI veya ALICI’nın gösterdiği adresteki kişi
	ve/veya kuruluşa tesliminden sonra ALICI'ya ait kredi kartının yetkisiz kişilerce haksız kullanılması
	sonucunda sözleşme konusu ürün bedelinin ilgili banka veya finans kuruluşu tarafından SATICI'ya ödenmemesi
	halinde, ALICI Sözleşme konusu ürünü 3 gün içerisinde nakliye gideri SATICI’ya ait olacak şekilde SATICI’ya
	iade edeceğini kabul, beyan ve taahhüt eder.
</p>
<p>
	<strong>5.8.</strong> SATICI, tarafların iradesi dışında gelişen, önceden öngörülemeyen ve tarafların
	borçlarını yerine getirmesini engelleyici ve/veya geciktirici hallerin oluşması gibi mücbir sebepler
	halleri nedeni ile sözleşme konusu ürünü süresi içinde teslim edemez ise, durumu ALICI' ya bildireceğini
	kabul, beyan ve taahhüt eder. ALICI da siparişin iptal edilmesini, sözleşme konusu ürünün varsa emsali
	ile değiştirilmesini ve/veya teslimat süresinin engelleyici durumun ortadan kalkmasına kadar ertelenmesini
	SATICI’ dan talep etme hakkına haizdir. ALICI tarafından siparişin iptal edilmesi halinde ALICI’ nın
	nakit ile yaptığı ödemelerde, ürün tutarı 14 gün içinde kendisine nakden ve defaten ödenir. ALICI’
	nın kredi kartı ile yaptığı ödemelerde ise, ürün tutarı, siparişin ALICI tarafından iptal edilmesinden
	sonra 14 gün içerisinde ilgili bankaya iade edilir. ALICI, SATICI tarafından kredi kartına iade edilen
	tutarın banka tarafından ALICI hesabına yansıtılmasına ilişkin ortalama sürecin 2 ile 3 haftayı bulabileceğini,
	bu tutarın bankaya iadesinden sonra ALICI’ nın hesaplarına yansıması halinin tamamen banka işlem süreci
	ile ilgili olduğundan, ALICI, olası gecikmeler için SATICI’ yı sorumlu tutamayacağını kabul, beyan
	ve taahhüt eder.
</p>

<h2>6. FATURA BİLGİLERİ</h2>

<p><strong>Ödeme Şekli :</strong> Kredi Kartı</p>
<p>
	<strong>Fatura Adresi :</strong> Kemeraltı Mah. 91. Sok. Hisar2 Apt. No: 44 Daire: 3 48700 Marmaris/Muğla/Türkiye
</p>

<h2>7. CAYMA HAKKI</h2>

<p>
	<strong>7.1.</strong> ALICI; mal satışına ilişkin mesafeli sözleşmelerde, ürünün kendisine veya gösterdiği
	adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde, SATICI’ya bildirmek
	şartıyla hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek
	sözleşmeden cayma hakkını kullanabilir. Hizmet sunumuna ilişkin mesafeli sözleşmelerde ise, bu süre
	sözleşmenin imzalandığı tarihten itibaren başlar. Cayma hakkı süresi sona ermeden önce, tüketicinin
	onayı ile hizmetin ifasına başlanan hizmet sözleşmelerinde cayma hakkı kullanılamaz. Cayma hakkının
	kullanımından kaynaklanan masraflar SATICI’ ya aittir. ALICI, iş bu sözleşmeyi kabul etmekle, cayma
	hakkı konusunda bilgilendirildiğini peşinen kabul eder.
</p>
<p>
	<strong>7.2.</strong> Cayma hakkının kullanılması için 14 (ondört) günlük süre içinde SATICI' ya iadeli
	taahhütlü posta, faks veya eposta ile yazılı bildirimde bulunulması ve ürünün işbu sözleşmede düzenlenen
	düzenlenen "Cayma Hakkı Kullanılamayacak Ürünler" hükümleri çerçevesinde kullanılmamış olması şarttır.
	Bu hakkın kullanılması halinde,
</p>
<p>
	<strong>7.2.1 3.</strong> kişiye veya ALICI’ ya teslim edilen ürünün faturası, (İade edilmek istenen
	ürünün faturası kurumsal ise, geri iade ederken kurumun düzenlemiş olduğu iade faturası ile birlikte
	gönderilmesi gerekmektedir. Faturası kurumlar adına düzenlenen sipariş iadeleri İADE FATURASI kesilmediği
	takdirde tamamlanamayacaktır.)
</p>
<p><strong>7.2.2.</strong> İade formu,</p>
<p>
	<strong>7.2.3.</strong> İade edilecek ürünlerin kutusu, ambalajı, varsa standart aksesuarları ile birlikte
	eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir.
</p>
<p>
	<strong>7.2.4.</strong> SATICI, cayma bildiriminin kendisine ulaşmasından itibaren en geç 10 günlük
	süre içerisinde toplam bedeli ve ALICI’ yı borç altına sokan belgeleri ALICI’ ya iade etmek ve 20 günlük
	süre içerisinde malı iade almakla yükümlüdür.
</p>
<p>
	<strong>7.2.5. </strong> ALICI’ nın kusurundan kaynaklanan bir nedenle malın değerinde bir azalma olursa
	veya iade imkânsızlaşırsa ALICI kusuru oranında SATICI’ nın zararlarını tazmin etmekle yükümlüdür.
	Ancak cayma hakkı süresi içinde malın veya ürünün usulüne uygun kullanılmasın sebebiyle meydana gelen
	değişiklik ve bozulmalardan ALICI sorumlu değildir.
</p>
<p>
	<strong>7.2.6.</strong> Cayma hakkının kullanılması nedeniyle SATICI tarafından düzenlenen kampanya
	limit tutarının altına düşülmesi halinde kampanya kapsamında faydalanılan indirim miktarı iptal edilir.
</p>

<h2>8. CAYMA HAKKI KULLANILAMAYACAK ÜRÜNLER</h2>

<p><strong>8.1.</strong></p>
<ul>
	<li>
		a) Fiyatı finansal piyasalardaki dalgalanmalara bağlı olarak değişen ve satıcı veya sağlayıcının
		kontrolünde olmayan mal veya hizmetlere ilişkin sözleşmeler.
	</li>
	<li>
		b) Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallara ilişkin
		sözleşmeler.
	</li>
	<li>
		c) Çabuk bozulabilen veya son kullanma tarihi geçebilecek malların teslimine ilişkin
		sözleşmeler.
	</li>
	<li>
		ç) Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan mallardan;
		iadesi sağlık ve hijyen açısından uygun olmayanların teslimine ilişkin sözleşmeler.
	</li>
	<li>
		d) Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan
		mallara ilişkin sözleşmeler.
	</li>
	<li>
		e) Malın tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olması
		halinde maddi ortamda sunulan kitap, dijital içerik ve bilgisayar sarf malzemelerine, veri
		kaydedebilme ve veri depolama cihazlarına ilişkin sözleşmeler.
	</li>
	<li>
		f) Abonelik sözleşmesi kapsamında sağlananlar dışında, gazete ve dergi gibi süreli yayınların
		teslimine ilişkin sözleşmeler.
	</li>
	<li>
		g) Belirli bir tarihte veya dönemde yapılması gereken, konaklama, eşya taşıma, araba kiralama,
		yiyecek-içecek tedariki ve eğlence veya dinlenme amacıyla yapılan boş zamanın
		değerlendirilmesine ilişkin sözleşmeler.
	</li>
	<li>
		ğ) Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen
		gayrimaddi mallara ilişkin sözleşmeler.
	</li>
	<li>
		h) Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile ifasına başlanan hizmetlere
		ilişkin sözleşmeler. Kozmetik ve kişisel bakım ürünleri, iç giyim ürünleri, mayo, bikini, kitap,
		kopyalanabilir yazılım ve programlar, DVD, VCD, CD ve kasetler ile kırtasiye sarf malzemeleri
		(toner, kartuş, şerit vb.) iade edilebilmesi için ambalajlarının açılmamış, denenmemiş,
		bozulmamış ve kullanılmamış olmaları gerekir.
	</li>
</ul>
<p>
	<strong>8.2.</strong> SATICI şikâyet ve itirazları konusunda başvurularını, aşağıdaki kanunda belirtilen
	parasal sınırlar dâhilinde tüketicinin yerleşim yerinin bulunduğu veya tüketici işleminin yapıldığı
	yerdeki tüketici sorunları hakem heyetine veya tüketici mahkemesine yapabilir. Parasal sınıra ilişkin
	bilgiler aşağıdadır:
</p>

<h3>28/05/2014 tarihinden itibaren geçerli olmak üzere:</h3>
<ul>
	<li>
		a) 6502 sayılı Tüketicinin Korunması Hakkında Kanun’un 68. Maddesi gereği değeri 2.000,00
		(ikibin) TL’ nin altında olan uyuşmazlıklarda ilçe tüketici hakem heyetlerine,
	</li>
	<li>
		b) Değeri 3.000,00 (üçbin) TL’ nin altında bulunan uyuşmazlıklarda il tüketici hakem
		heyetlerine,
	</li>
	<li>
		c) Büyükşehir statüsünde bulunan illerde ise değeri 2.000,00 (ikibin) TL ile 3.000,00 (üçbin) TL
		arasındaki uyuşmazlıklarda il tüketici hakem heyetlerine başvuru yapılmaktadır.
	</li>
</ul>
<p>İşbu Sözleşme ticari amaçlarla yapılmaktadır.</p>

<h4>SATICI</h4>
*****************************

<h4>ALICI</h4>
<p><strong>Adı/Soyadı/Ünvan :</strong> {form?.data?.unvan || '?'}</p>
<p><strong>Tarih :</strong> {today}</p>

<style>
	h1 {
		font-size: 30px;
	}
	h2 {
		font-size: 24px;
	}
	h3 {
		font-size: 20px;
	}
	h4 {
		font-size: 18px;
	}
	li {
		list-style: none;
	}
</style>
