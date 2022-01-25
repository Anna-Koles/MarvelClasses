class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // начало адреса, чтобы не повторяться, начинается с _ ,чтобы показать, что его нельзя менять
    _apiKey = 'apikey=581f4995f32a6f6dbd53e6113b3cd1c2';
    _baseOffset = 210; // offset (отступ) задан в личном кабинете API, такой нужен, чтобы больше персонажей были с картинками, раньше него много без картинок

    getResource = async (url) => {  
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`); // limit установлен в 9, т.к. на странице изначально должно отображаться 9 персонажей
        return res.data.results.map(this._transformCharacter);
        // приходит объект, в его свойстве data есть свойство results и в нем нужный массив объектов с персонажами; map делает новый массив с нужными элементами
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);  // приходит только один объект (один персонаж) из res.data.results[0]
    }

    _transformCharacter = (char) => { // трансформация полученных данных в новый объект, char - это что приходит из res.data.results[0]
        return {
            id: char.id, // чтобы потом его сделать key
            name: char.name,
            description: char.description ? `${char.description.slice(0, 200)}...` : 'There is no description for this character', // slice в описании - чтобы обрезать слишком длинные тексты
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension, // т.к. в thumbnail придет объект с двумя свойстами - путь и расширение файла (напр. jpeg)
            homepage: char.urls[0].url,  // в urls - url и wiki вместе, а здесь надо взять только url
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;