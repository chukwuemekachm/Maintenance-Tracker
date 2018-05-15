const toggleModal = (id, me) => {
    if (document.getElementById('modal').style.display === 'block') {
        document.getElementById('modal').style.display = 'none';
        document.getElementById(id).style.display = 'none';
        me.innerHTML = 'New Request';
    } else {
        document.getElementById('modal').style.display = 'block';
        document.getElementById(id).style.display = 'block';
        me.innerHTML = 'Cancel Request';
    }
};