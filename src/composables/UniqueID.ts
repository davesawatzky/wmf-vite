let UUID = 0

export default function UniqueID() {
  const getID = () => {
    UUID++
    const id = UUID.toString
    return id
  }

  return {
    getID
  }
}
