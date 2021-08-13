

var img = document.getElementById('profile-img');
var originalImg = img.src;
// https://developer.mozilla.org/zh-TW/docs/Web/API/URL/createObjectURL
document.querySelector('input[type="file"]').addEventListener('change', function() {
    // event triggered by selecting img
    // check if any file uploaded
    if (this.files && this.files[0]) {
        // free up memory
        img.onload = () => {
            URL.revokeObjectURL(img.src);
        }
        // set img src to blob url
        // https://stackoverflow.com/questions/30864573/what-is-a-blob-url-and-why-it-is-used
        img.src = URL.createObjectURL(this.files[0]);
        document.querySelector('form').hidden = false;
        document.getElementById('cancel-btn').hidden = false;
    }
});
//click hidden button to trigger form submit action
document.getElementById('update-btn').addEventListener('click', (event)=>{
    document.querySelector('input[type="file"]').click();
})
//When canceling updating img, free up img memory and set src to its origin
document.getElementById('cancel-btn').addEventListener('click', (event)=>{
    event.preventDefault()
    URL.revokeObjectURL(img.src);
    img.src = originalImg;
    event.target.hidden = true;
    document.querySelector('form').hidden = true;
})