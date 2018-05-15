/**
 * Toggles Modals
 * @param {string} id - The id of the Modal to be toggled 
 * @param {object} me - The object calling the toggle method, {optional} 
 */
const toggleModal = (id, me) => {
    if (document.getElementById('modal').style.display === 'block') {
        document.getElementById('modal').style.display = 'none';
        document.getElementById(id).style.display = 'none';
        if (me) me.innerHTML = 'New Request';
    } else {
        /** Device width */
        const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        if (id === 'add-request' && width < 769) {
            document.getElementById('modal').style.top = '12em';
        } else {
            document.getElementById('modal').style.top = '3.8em';
        }
        if (id === 'add-request' && width > 769) {
            document.getElementById('modal').style.top = '3.8em';
            document.getElementById('modal').style.top = '3.8em';
        }
        document.getElementById('modal').style.display = 'block';
        document.getElementById(id).style.display = 'block';
        if (me) me.innerHTML = 'Cancel Request';
    }
};