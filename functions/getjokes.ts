import axios from "axios"
export async function getjokes(){
    return await axios.get('https://api.chucknorris.io/jokes/random')
}