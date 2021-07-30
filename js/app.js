const docLength = document.querySelector('#docLength')
const wordCount = document.querySelector('#wordCount')
const MostUsedWords = document.querySelector('#mostUsedWords')
const LeastUsedWords = document.querySelector('#leastUsedWords')


//loading a book

function loadBook(filename, displayName) {
    let currentBook = "";
    let url = filename;

    //reset our UI
    document.getElementById("fileName").innerText = displayName;
    document.getElementById("searchstat").innerText = "";
    MostUsedWords.innerHTML = "";
    LeastUsedWords.innerHTML = "";
    docLength.innerHTML = "";
    wordCount.innerHTML = "";
    document.getElementById("keyword").value = "";
    const Content = document.querySelector('#fileContent')

    //create a server request 
    fetch(url)
        .then(res => {
            return res.text()
        })
        .then(data => {
            currentBook = data;
            Content.innerHTML = currentBook;
            fillDocumentStat(currentBook);
            Content.scrollTop = 0;
        })
        .catch(e => {
            console.log("oh no! error!!", e);
        })
}


function getLink() {
    const lis = document.querySelectorAll('li');
    for (let i = 0; i < lis.length; i++) {
        lis[i].addEventListener('click', function (evt) {
            // evt.preventDefault();
            const url = lis[i].firstChild.getAttribute("href");
            const name = url.split('txt')[0];
            loadBook(url, name.substring(8, name.length - 1));
        })
    }
}

function stopLinks() {
    const bookLinks = document.querySelectorAll("#bookLink");
    for (bl of bookLinks) {
        bl.addEventListener('click', function (evt) {
            evt.preventDefault();
        })
    }
}

stopLinks();
getLink();






function appendli(src, stat) {
    const li = document.createElement('li');
    li.append(stat);
    src.append(li);
}

function isOk(string) {
    const noise = new Set()
    noise.add("the"); noise.add("and"); noise.add("said"); noise.add("of"); noise.add("to"); noise.add("was"); noise.add("my"); noise.add("&"); noise.add("be"); noise.add("that"); noise.add("have"); noise.add("for"); noise.add("not"); noise.add("he"); noise.add("she"); noise.add("her"); noise.add("him"); noise.add("you"); noise.add("me"); noise.add("well"); noise.add("how"); noise.add("its"); noise.add("than"); noise.add("then"); noise.add("some"); noise.add("me"); noise.add("a"); noise.add("with"); noise.add("go"); noise.add("get"); noise.add("just"); noise.add("an");
    noise.add("but"); noise.add("as"); noise.add("like"); noise.add("there"); noise.add("any"); noise.add("those"); noise.add("had"); noise.add("they"); noise.add("very"); noise.add("your"); noise.add("were"); noise.add("for"); noise.add("else"); noise.add("his"); noise.add("for"); noise.add("it"); noise.add("in"); noise.add("at"); noise.add("on"); noise.add("i"); noise.add("you"); noise.add("am"); noise.add("will"); noise.add("is"); noise.add("are"); noise.add("this"); noise.add("that"); noise.add("we")
    noise.add("-"); noise.add(""); noise.add("--"); noise.add(" ");
    if (noise.has(string))
        return false;
    return true;
}

function fillDocumentStat(filecontent) {
    filecontent = filecontent.toLocaleLowerCase();
    filecontent = filecontent.replaceAll(',', '');
    filecontent = filecontent.replaceAll('.', '');
    filecontent = filecontent.replace(/<[^>]+>/g, '');
    const arr = filecontent.split(' ');
    const Dictionary = {};

    //populating the dictionary
    for (let word of arr) {
        if (Dictionary[word] > 0) {
            Dictionary[word] += 1;
        }
        else {
            Dictionary[word] = 1;
        }
    }


    //change dictionary to array and then sort
    const newArr = Object.entries(Dictionary);
    newArr.sort(function (a, b) {
        return b[1] - a[1]
    })


    //most used words
    let w = 0;
    for (let a = 0; a < newArr.length; a++) {
        if (w > 5) {
            break;
        }
        if (isOk(newArr[a][0])) {
            w++;
            const stat1 = `${newArr[a][0]}: ${newArr[a][1]} time(s)`
            appendli(MostUsedWords, stat1);
        }
    }

    //least used words
    for (let a = newArr.length - 1; a >= 0; a--) {
        if (a < newArr.length - 5) {
            break;
        }
        const stat2 = `${newArr[a][0]}: ${newArr[a][1]} time(s)`
        appendli(LeastUsedWords, stat2);
    }

    // doc length
    docLength.innerHTML = "Doc length: " + filecontent.length;

    //word count
    wordCount.innerHTML = "Words: " + arr.length;

}

const keyword = document.querySelector('#keyword')
const btn = document.querySelector('#srchBtn')
btn.addEventListener('click', function (evt) {
    const word = keyword.value;
    keyword.value = "";
    highlight(word);
})

function highlight(keyword) {

    const Content = document.querySelector('#fileContent');
    let bookCont = Content.innerText;
    let newCont = "";
    if (keyword === "") {
        alert("choose a word");
    }
    else if (bookCont === "Please select a book from right") {
        alert("select a book");
    }
    else {
        //remove previously marked marker
        let spans = document.querySelectorAll('#markme')
        for (span of spans) {
            span.outerHTML = span.innerHTML;
        }

        let re = new RegExp(keyword, "gi");
        let newtext = "<span id='markme'>$&</span>";
        newCont = bookCont.replace(re, newtext);
        Content.innerHTML = newCont;

        let count = document.querySelectorAll('#markme');
        const statbox = document.querySelector("#searchstat")
        if (count.length > 0) {
            statbox.innerHTML = `${count.length} searches found for '${keyword}'`
            let elem = document.querySelector("#markme")
            elem.scrollIntoView();
        }
        else {
            statbox.innerHTML = "didn't find any matches"
        }

    }
}

