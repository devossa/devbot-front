import pluralize from 'pluralize'

export const stringifyPrice = (price: { keys?: number; metal?: number }) => {
	let res = ''
	if (price.keys) res += `${pluralize('key', price.keys, true)}`
	if (price.keys && price.metal) res += ', '
	if (price.metal) res += `${price.metal} ref`

	return res
}
