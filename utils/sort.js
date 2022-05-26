const sort = Array.prototype.sort

export default function (list, comparator) {
  const outList = sort.call(list, comparator)
  return outList
}
