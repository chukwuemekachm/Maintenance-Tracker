const toggleModal = (id, me) => {
    if (document.getElementById('modal').style.display === 'block') {
        document.getElementById('modal').style.display = 'none';
        document.getElementById(id).style.display = 'none';
        if (me) me.innerHTML = 'New Request';
    } else {
        if (id === 'add-request') {
            document.getElementById('modal').style.top = '12em';
        } else {
            document.getElementById('modal').style.top = '3.8em';
        }
        document.getElementById('modal').style.display = 'block';
        document.getElementById(id).style.display = 'block';
        if (me) me.innerHTML = 'Cancel Request';
    }
};