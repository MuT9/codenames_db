const WORDS_COUNT = 25;

// TODO найти словарь
const getDictionary = () => [
    'тест1', 'тест2', 'тест3', 'тест4', 'тест5',
    'тест6', 'тест7', 'тест8', 'тест9', 'тест10',
    'тест11', 'тест12', 'тест13', 'тест14', 'тест15',
    'тест16', 'тест17', 'тест18', 'тест19', 'тест20',
    'тест21', 'тест22', 'тест23', 'тест24', 'тест25'
];

const getColors = () => [
    'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red',
    'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue',
    'gray', 'gray', 'gray', 'gray', 'gray', 'gray', 'gray',
    'black'
];

const generateField = () => {
    const words = getDictionary().sort(() => Math.random() - 0.5).slice(0, WORDS_COUNT);
    const colors = getColors().sort(() => Math.random() - 0.5).slice(0, WORDS_COUNT);

    return words.map((word, index) => ({
        word,
        color: colors[index]
    }))
};

module.exports = generateField;