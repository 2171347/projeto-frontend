import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import { alpha_spaces} from "vee-validate/dist/rules";
import {length} from "vee-validate/dist/rules";
import {numeric} from "vee-validate/dist/rules";
import {max} from "vee-validate/dist/rules";
import {email} from "vee-validate/dist/rules";
import {regex} from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "Este campo é obrigatório"
});
extend("alpha_spaces", {
  ...alpha_spaces,
  message: "Este campo apenas pode conter letras."
});


extend('numeroDecimal',{
  validate(value){

  }
});
extend('codigoPostal',  {
  validate(value){
    if (value.includes("-") && value.length === 8){
      let res = value.split("-");
      if (res[0].length === 4 && res[1].length === 3){
        if (res[0].match(/^[0-9]+$/) != null && res[1].match(/^[0-9]+$/) != null)
          return true
      }
    }
    return false
  },
  message:"Código Postal deve seguir o padrão XXXX-XXX"
});
extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'As palavras-chave não são iguais.'
});
extend("length", {
  ...length,
  message: 'O campo não é válido'
});
extend("numeric", {
  ...numeric,
  message: 'O campo deve conter apenas algarismos'
});
extend('max', {
  ...max,
  message: '{_field_} deve ter no máximo {length} caracteres',
});
extend('email', {
  ...email,
  message: 'Email deve estar no formato: nome@exemplo.com',
});
