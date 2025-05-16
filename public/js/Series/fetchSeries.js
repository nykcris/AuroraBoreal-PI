class fetchSeries {

    serieSelect;

    constructor() {
        this.serieSelect = document.querySelectorAll(".serie-select");
    }

    init() {
        this.fetchSeries();
        this.SelectSeriesfetch();
        console.log("fetchSeries");
    }

    fetchSeries() {
        fetch('/system/serie/fetchSeries', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                this.serieSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(serie => {
                        let option = document.createElement('option');
                        option.value = serie.id;
                        option.text = serie.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    SelectSeriesfetch(number) {
        fetch('/system/serie/fetchSeries', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                let sel = ".serie-select";
                if (number != null) {
                    sel += "-" + number;
                }
                let serieSelect = document.querySelectorAll(sel);
                serieSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(serie => {
                        let option = document.createElement('option');
                        option.value = serie.id;
                        option.text = serie.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }
}

module.exports = fetchSeries;