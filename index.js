const onOperator = strOrRegex => source =>
  source.filter(({ type }) => strOrRegex.match(type))

module.exports = onOperator
