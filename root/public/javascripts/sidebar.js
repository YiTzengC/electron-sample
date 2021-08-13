//add dynamic class to sidebar to indicate user's current page

switch (window.location.pathname) {
    case '/account':
        addActiveLinkClass('account')
        break;
    case '/account/myevent':
        addActiveLinkClass('myevent')
        break;
    case '/account/joined-event':
        addActiveLinkClass('joined')
        break;
    }

function addActiveLinkClass(id) {
    let li =  document.getElementById('links').children
    for (let index = 0; index < li.length; index++) {
        //<a></a>
        let a = li[index].querySelector('a')
        if(a.id == id)
        a.classList.add('active-dark')
        else
        a.classList.add('link-dark')
    }
}
