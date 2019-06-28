$(function () {

    const el = {
        input: $('#autocompele-input'),
        title: $('.title'),
        tabLabel: $('.tab-label'),
        original: $('.original-text'),
        tabEn: $('.tab-en-container'),
        tabElementsEn: $('.tab-el-en'),
        tabRu: $('.tab-ru-container'),
        tabElementsRu: $('.tab-el-ru'),
        video: $('.video')
    };

    $.getJSON("poems.json", function (poems) {
        const poemNumber = getPoemNumberFromQueryString();
        const poem = getPoemObject(poems, poemNumber) || poems[0];
        el.input.val(poem.value);
        setPoemToMarkup(poem);
        awesomeCompleteInit(poems);
    });

    /**
     * Set object to markup
     * @param poem
     */
    function setPoemToMarkup(poem) {
        el.title[0].innerHTML = poem.value;
        el.original[0].innerHTML = poem.text;
        if (poem.video) {
            el.video[0].innerHTML = poem.video;
        }
        setLocaleRu(poem);
        setLocaleEn(poem);
        el.tabLabel.filter(':visible:first').prev().prop('checked', true);
    }

    function setLocaleRu(poem) {
        if (poem.locale.ru) {
            el.tabRu[0].innerHTML = poem.locale.ru;
            el.tabElementsRu.show();
        } else {
            el.tabElementsRu.hide();
            el.tabRu[0].innerHTML = ''
        }
    }

    function setLocaleEn(poem) {
        if (poem.locale.en) {
            el.tabEn[0].innerHTML = poem.locale.en;
            el.tabElementsEn.show();
        } else {
            el.tabEn[0].innerHTML = '';
            el.tabElementsEn.hide();
        }
    }

    /**
     * Get poem object
     * @param label
     * @returns {*}
     */
    function getPoemObject(poems, label) {
        return poems.filter(function (item) {
            return item.label === label;
        })[0];
    }

    /**
     * Init awesomecomplete plugin
     * @param list
     */
    function awesomeCompleteInit(list) {
        const comboplete = new Awesomplete('#autocompele-input', {
            minChars: 0,
            list: list,
            autoFirst: true,
            maxItems: 20,
        });

        Awesomplete.$('.dropdown-btn').addEventListener("click", function () {
            if (comboplete.ul.childNodes.length === 0) {
                comboplete.minChars = 0;
                comboplete.evaluate();
            } else if (comboplete.ul.hasAttribute('hidden')) {
                comboplete.open();
            } else {
                comboplete.close();
            }
        });

        document.getElementById('autocompele-input').addEventListener("awesomplete-select", function (event) {
            console.log(event.text.label, event.text.value);
            const poem = getPoemObject(list, event.text.label);
            setPoemToMarkup(poem);
            updateQueryStringParam('poem', poem.label);
        });
    }

    /**
     * Update query string param
     * @param key
     * @param value
     */
    function updateQueryStringParam(key, value) {
        let uri = window.location.href;
        const re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
        const separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            uri = uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            uri = uri + separator + key + "=" + value;
        }
        window.history.replaceState({}, "", uri);
    }

    function getPoemNumberFromQueryString() {
        const params = new URLSearchParams(location.search);
        return params.get('poem');
    }
});

