
export default {

    alert: function(msg) {
        alert(msg);
    },

    confirm: function(msg) {
        return new Promise((resolve) => {
            resolve(window.confirm(msg))
        });
    }
}