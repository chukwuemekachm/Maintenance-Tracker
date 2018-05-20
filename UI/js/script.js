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
        document.getElementById('modal').style.display = 'block';
        document.getElementById(id).style.display = 'block';
        if (me) me.innerHTML = 'Cancel Request';
    }
};

/**
 * Displays a custom message
 * @param {string} message - The message to be displayed on the alert
 * @param {number} id - The id which determines the backgroundcolor and message type
 */
const displayAlert = (message, id) => {
    document.getElementById('display').style.display = 'block';
    switch (id) {
        case 1:
            /** Success Message */
            document.getElementById('display').style.backgroundColor = '#80ffc1';
            document.getElementById('alert').innerHTML = message;
            break;
        case 2:
            /** Information Message */
            document.getElementById('display').style.backgroundColor = '#ffff80';
            document.getElementById('alert').innerHTML = message;
            break;
        case 3:
            /** Warning Message */
            document.getElementById('display').style.backgroundColor = '#ff6666';
            document.getElementById('alert').innerHTML = message;
            break;
        default:
            /** Default Message */
            document.getElementById('display').style.backgroundColor = '#4d94ff';
            document.getElementById('alert').innerHTML = message;
            break;
    }
    setTimeout(() => {
        document.getElementById('display').style = 'none';
    }, 4000);
};

const toggleNav = () => {
    if (document.getElementById('nav').style.display === 'none') {
        document.getElementById('nav').style.display = 'block';
    } else {
        document.getElementById('nav').style.display = 'none';
    }
}