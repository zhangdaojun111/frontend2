const Form = {
    getValue(form){
        form = $(form);
        let res = {};
        form.find(':input').each(function () {
            let $this = $(this);
            let type = $this.attr('type');
            let name = $this.attr('name');
            let value = $this.val();
            let isCheckbox = $this.is(':checkbox');
            let isRadio = $this.is(':radio');
            let checked = $this.is(':checked');
            let visible = $this.is(':visible');

            if ((!visible && type!=='hidden') || (type === 'button')) {
                return;
            }

            if (!(name === '' || name === undefined)) {
                if (isCheckbox) {
                    res[name] = res[name] || [];
                    res[name].push(value);
                } else if (isRadio) {
                    if (checked) {
                        res[name] = value;
                    }
                } else {
                    res[name] = value;
                }
            }
        });
        return res;
    }
}

export {Form}