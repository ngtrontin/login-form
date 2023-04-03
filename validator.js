function Validator (options) {
    var selectorRules = {}

    /** xử lý khi lỗi chưa nhập đúng thông tin */
    function validate(inputElements, errorElement, rule) {
        var errorMessage

        var rules = selectorRules[rule.selector]
        for (var i = 0 ; i < rules.length ; ++i) {
            errorMessage = rules[i](inputElements.value)
            if (errorMessage) break;    
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage
            inputElements.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = '';
            inputElements.parentElement.classList.remove('invalid')
        }
        return !errorMessage
    }

    /** lấy form elements cần xử lý */
    var formElement = document.querySelector(options.form)
    if (formElement) {

        formElement.onsubmit = function (e) {
            e.preventDefault()
            var isFormValid = true
            options.rules.forEach(function (rule) {
                var inputElements = formElement.querySelector(rule.selector)
                var errorElement = inputElements.parentElement.querySelector(options.errorElement)
                var isValid = validate(inputElements, errorElement, rule)
                if (!isValid) {
                    isFormValid = false
                }
            })
            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {

                    var enablueInput = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValues = Array.from(enablueInput).reduce(function (values, input) {
                        var genderElement = formElement.querySelector('input:checked')
                        
                        values[input.name] = input.value
                        if (input.type === 'radio') {
                            values[input.name] = genderElement.value
                        }
                        return values
                    },{})
                } 
            }
        } 

        options.rules.forEach(function(rule) {

            /** lưu các rules */
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElements = formElement.querySelector(rule.selector)
            var errorElement = inputElements.parentElement.querySelector(options.errorElement)
            if (inputElements) {
                inputElements.onblur = function () {
                    validate(inputElements, errorElement, rule)
                }

                inputElements.oninput = function () {
                    errorElement.innerText = '';
                    inputElements.parentElement.classList.remove('invalid')
                }
            }
       }) 

    }
}

/** rules define */
isRequired= function (selector, text) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : text||`Vui lòng nhập trường này`  
        },
    }
}

isEmail= function (selector, text) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : text
        },
    }
}
passwordLength = function (selector, minLength) {
    return {
        selector: selector,
        test: function (value) {
            var min = minLength
            return value.length >= min  ? undefined : `Vui lòng nhập tối thiểu ${minLength} kí tự`
        },
    }
} 
isConfirmed = function (selector, confirmed) {
    return {
        selector: selector,
        test: function (value) {
            return value === confirmed() ? undefined : `k dung`
        },
    }
}