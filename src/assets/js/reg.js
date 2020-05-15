function RegValue(reg, value)  {
  let $reg = new RegExp(reg);
  return $reg.test(value);
}

export {
  RegValue
}