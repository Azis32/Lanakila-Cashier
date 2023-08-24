
function ambilDataProduk() {
 db.ExecuteSql("select * from produk where nama like '" + produk.GetText() + "%' order by nama limit 0,10;", [], function(rslt) {
   if (rslt.rows.length < 1 || "" == produk.GetText()) {
     dlgRef.Dismiss();
   } else {
     dlgRef.Show();
   }
   listSgg = "";
   var marked = 0;
   for (; marked < 20; marked++) {
     var b = rslt.rows.item(marked);
     listSgg = listSgg + (b.nama + ":") + b.harga + "/" + b.satuan + ":null#";
     lstRef.SetList(listSgg, "#");
   }
 });
}
function padFront(result, value, len) {
 for (; String(result).length < len;) {
   result = value + result;
 }
 return result;
}
function padEnd(s, str, maxLength) {
 for (; String(s).length < maxLength;) {
   s = s + str;
 }
 return s;
}
function buatStruk(instruction, str) {
 db.ExecuteSql("select * from penjualan;", [], function(rslt) {
   bodi = "";
   Tot = 0;
   strukProfit = 0;
   var i = 0;
   for (; i < rslt.rows.length; i++) {
     var r = rslt.rows.item(i);
     pro = padEnd(r.produk.substr(0, 31), " ", 31);
     jum = padEnd(r.jumlah + " " + r.satuan, " ", 7);
     har = padEnd(Number(r.harga).toLocaleString(), " ", 9);
     tot = padFront(Number(r.total).toLocaleString(), " ", 12);
     Tot = Tot + r.total;
     strukProfit = strukProfit + r.profit;
     bodi = bodi + (pro + "\n") + jum + " x " + har + "=" + tot + "\n";
   }
   var n = padFront(Tot.toLocaleString(), " ", 24);
   var o = padFront(Number(str).toLocaleString(), " ", 26);
   var l = padFront((str - Tot).toLocaleString(), " ", 25);
   edt.SetText(header + "\n" + garis + "\n" + "Tenan : tes user\n"+"Nama : " + instruction + "\n" + garis + "\nTotal Rp" + n + "\nBayar " + o + "\nKembali" + l + "\n" + garis + "\n" + footer);
 });
}
function addToStruk() {
 db.ExecuteSql("select * from penjualan;", [], function(rslt) {
   var baseUrl = "";
   var i = 0;
   for (; i < rslt.rows.length; i++) {
     var layer = rslt.rows.item(i);
     baseUrl = baseUrl + (layer.produk + ":") + layer.jumlah + " " + layer.satuan + " x " + layer.harga.toLocaleString() + ":null#";
     lstStruk.SetList(baseUrl, "#");
}
   });
}
function editStruk() {
 sup.PlayAnim(this, "Bounce");
 var Modal = app.CreateDialog("Sentuh untuk menghapus");
// Modal.SetBackColor("white");
 layDlg = app.CreateLayout("linear", "vertical,fillxy,left");
 layDlg.SetPadding(0.01, 0,0.01,0.01);
// layDlg.SetBackColor("white");
 Modal.AddLayout(layDlg);
 lstStruk = app.CreateList("", 1,0.6);
// lstStruk.SetBackColor("black");
 lstStruk.SetOnTouch(function(type) {
   db.ExecuteSql("DELETE FROM penjualan WHERE produk='" + type + "';");
   buatStruk("...", 0);
   Modal.Dismiss();
   app.SendText(type + " dihapus");
 });
 layDlg.AddChild(lstStruk);
 db.ExecuteSql("select * from penjualan;", [], function(rslt) {
   var baseUrl = "";
   var i = 0;
   for (; i < rslt.rows.length; i++) {
     var layer = rslt.rows.item(i);
     baseUrl = baseUrl + (layer.produk + ":") + layer.jumlah + " " + layer.satuan + " x " + layer.harga.toLocaleString() + ":null#";
     lstStruk.SetList(baseUrl, "#");
   }
   Modal.Show();
 });
}
function bayar() {
 sup.PlayAnim(this, "Bounce");
 var Modal = app.CreateDialog("Jumlah dibayarkan");
 layDlg = app.CreateLayout("linear", "vertical,fillxy,left");
 layDlg.SetPadding(0.05, 0,0.01,0.01);
 Modal.AddLayout(layDlg);
 namaPembeli = sup.CreateTextEdit("",0.7, null, "floating");
namaPembeli.SetTextColor("black")
 namaPembeli.SetHint("Nama pembeli (opsional)");
 layDlg.AddChild(namaPembeli);
 jumlahDibayarkan = sup.CreateTextEdit("",0.7, null, "floating,number");
jumlahDibayarkan.SetTextColor("black")
 jumlahDibayarkan.SetHint("Jumlah dibayar");
 layDlg.AddChild(jumlahDibayarkan);
 btnOk = app.CreateButton("Proses",0.8,0.1, "custom");
 btnOk.SetOnTouch(function() {
   sup.PlayAnim(this, "Bounce");
   pembeli = namaPembeli.GetText();
   jmlhDiBayar = jumlahDibayarkan.GetText().replace(/[.,]/g, "");
   buatStruk(pembeli, jmlhDiBayar);
   Modal.Dismiss();
   app.SaveBoolean("Dibayar", true);
 });
 layDlg.AddChild(btnOk);
 Modal.Show();
 sup.PlayAnim(layDlg, "SlideFromBottom");
 app.ShowKeyboard(jumlahDibayarkan);
}
dlgRef = app.CreateDialog("Auto fill", "NoTitle,NoDim,NoFocus"), dlgRef.SetPosition(0.3,0.17);
var layRef = app.CreateLayout("linear", "vertical,fillxy,left");
layRef.SetPadding(0.02, 0,0.02,0.02), dlgRef.AddLayout(layRef);
var list = "";
lstRef = app.CreateList(list,0.7,0.4), lstRef.SetOnTouch(function(value, nameOfRoute, canCreateDiscussions, isSlidingUp) {
 produk.SetText(value);
 harga.SetText(nameOfRoute.split("/")[0]);
 jumlah.SetText("1");
 btnAddToStruk.SetVisibility("show");
 app.ShowKeyboard("SatuanAktif", nameOfRoute.split("/")[1]);
 spinSat.SelectItem(nameOfRoute.split("/")[1].toUpperCase());
 dlgRef.Dismiss();
}), layRef.AddChild(lstRef);