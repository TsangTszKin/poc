const formRules = {
    name: [
        { required: true, message: '请输入名称' },
        { max: 32, message: '最大长度32' },
    ],
    code: [
        { required: true, message: '请输入标识' },
        { message: '请输入字母，数字，下划线', pattern: new RegExp("^[A-Za-z0-9_]+$") },
        { max: 12, message: '最大长度12' },
    ],
    number: [
        { message: '请输入数字', pattern: new RegExp("^[0-9.]+$") },
    ],
    int: [
        { message: '请输入整数', pattern: new RegExp("^[0-9]+$") },
    ],
    range: (min, max, isInt = false) => [
        {
            validator: (rule, value, callback) => {
                let num = Number(value);
                if (min && max && value &&
                    (num < min ||
                        num > max ||
                        Number.isNaN(num) ||
                        (isInt && !Number.isInteger(num))
                    )
                ) {
                    callback(`请输入${ min }到${ max }的${ isInt ? '整数': '数字' }`);
                }
                callback()
            }
        }
    ]
};

export default formRules;