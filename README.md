# Skaly
Simple application used for charting exam points

## Uputstvo
Aplikacija se startuje na login strani. Dugme 'Register' vodi na stranu
za registrovanje novog korisnika. Dugme 'Login' sa unetim informacijama
vodi na glavnu stranu aplikacije. 

### Tipovi korisnika
- Moderator - ne unosi poene, vec kreira skalu
- Standard - pretplati se na postojecu skalu i za nju unosi poene

### Glavna strana
Sa leve strane se dodaju predmeti klikom na dugme '+', zatim unоsenjem 
imena predmeta. Klikom na predmet se otvara skala.

#### Moderator
Moderator moze da unese novu skalu sa jedinstevnim imenom u odnosu na ceo sistem.

Iz gornjeg reda se u tabelu prevlace obaveze. 

Polja se resize-uju klikom na polje, zatim klikom na crveni kruzic za
smanjivanje i klikom na zeleni kruzic za povecavanje.

Velicina polja odredjuje udeo u konacnoj oceni u procentima.

#### Standard
Stadardni korisnik moze da unese samo skalu koja postoji u sistemu.

Klikom na polje u skali se pojavljuju dva input polja za unosenje dobijene ocene.
U levo polje se unosi broj osvojenih poena, u desno maksimalni broj poena.

Klikom na dugme Calculate se prikazuje broj najvise osvojenih poena (po skali).

## FUNKCIONALNI NEDOSTACI:
- Problemi sa drag and drop


