document.getElementById('search').addEventListener('search', filter)
document.getElementById('search').addEventListener('keyup', filter)

function filter(event) {
    //what to search
    let index = 0
    let tag = document.getElementById('search-tag').value
    // determine target to be searched
    if(tag == 'Sport')
        index = 1
    else if(tag == 'Initiator')
        index = 0
    else if(tag == 'Location')
        index = 3

    let cards = document.querySelectorAll('.card')

    for(let i = 0; i < cards.length ; i++){
        let spans = cards[i].querySelector('.card-body').querySelectorAll('span')
        let text = spans[index].textContent;
        // hide card if it cannot be found
        if(text.substring(text.indexOf(tag) + tag.length).toUpperCase().includes(event.target.value.toUpperCase())){
            cards[i].hidden = false
        }
        else{
            cards[i].hidden = true
        }
    }
}