# uz-multiagent-app

Zadania:

- [x] Giełda samochodowa 10 agentów sprzedających pojazdy(po 8 dla każdego agenta sprzedającego), 3 agentów kupujących pojazdy (każdy kupuje po 3 samochody).


- [x] Właściwości obiektu jakim jest samochód: marka, model, typ nadwozia, typ silnika, pojemność silnika, rok produkcji, cena. Należy dodać również koszt opłat dodatkowych jako wartość charakteryzującą atrakcyjność danej oferty. Seller kupujący powinien optymalizować całkowity koszt zakupu w postaci koszt pojazdu + koszt dodatkowy.


- [x] Należy założyć budżet startowy dla każdego z kupujących np. 100 tyś PLN. Budżet ten jest pomniejszany w chwili wykonania zakupu przez agenta kupującego.


- [ ] Rozpatrzyć przypadek, w którym: jest więcej kupujących i dochodzi do sytuacji, w której sprzedawca odpowie z propozycją jednemu z kupców i zanim jego samochód zostanie sprzedany zaproponuje jego sprzedaż innemu kupcowi. Drugi z kupców również uzna ją za najatrakcyjniejszą ofertę, ale nie będzie mógł jej już kupić ponieważ zostanie ona w międzyczasie sprzedana pierwszemu z nich.


- [ ] Sytuacja ta pogorszy się dodatkowo gdy ten sam sprzedawca będzie miał w swojej ofercie dwa takie same modele samochodów o takich samych parametrach ale w różnej cenie. Należy założyć w takim przypadku wybór oferty tańszej.


- [ ] Dodatkowo zaprojektować mechanizm umożliwiający na określony czas rezerwację oferty zakupu samochodu.