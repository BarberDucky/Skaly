# Skaly
Simple application used for charting exam points

### Uputstvo
Aplikacija se startuje na login strani. Dugme 'Register' vodi na stranu
za registrovanje novog korisnika. Dugme 'Login' sa unetim informacijama
vodi na glavnu stranu aplikacije. 
Sa leve strane se dodaju predmeti klikom na dugme '+', zatim unоsenjem 
imena predmeta i zeljene boje. Klikom na predmet se otvara skala.

Iz gornjeg reda se u tabelu prevlace obaveze. 

Polja se resize-uju klikom na polje, zatim klikom na crveni kruzic za
smanjivanje i klikom na zeleni kruzic za povecavanje.

Velicina polja odredjuje udeo u konacnoj oceni u procentima.

Dvostrukim klikom na polje se pojavljuju dva polja za unosenje dobijene ocene.
U levo polje se unosi broj osvojenih poena, u desno maksimalni broj poena.

Klikom na dugme Calculate se prikazuje broj najvise osvojenih poena (po skali).

Tabela i poeni se cuvaju u bazi pritiskom na dugme 'Save', inace se izmene brisu.

### FUNKCIONALNI NEDOSTACI:
- Tabela je <table> html element i velicina polja se odredjuje preko 
column-span atributa. Zbog toga ce da se poremeti raspored ako u sve tri
skale postoji po jedan prosiren element u istoj vertikalnoj osi

### KOZMETICKI NEDOSTACI: 
- Forme nemaju labele kod inputa
- Forma za unos poena nije formatirana
- Nedostaje ime aplikacije u headeru, login i register stranicama
- Stil je globalno nedovrsen
