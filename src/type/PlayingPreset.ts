type PlayingPreset = {
  id: string
  name: string
  bgColor: string
  opacity: number
  orders: {
    source: string
    time: number
    duration: number
  }[]
}
export default PlayingPreset;
