import { uniqueNamesGenerator, names, adjectives } from 'unique-names-generator';
import { Data } from '@/interfaces/index'

const generateName = (): string =>
{
  return uniqueNamesGenerator({
    dictionaries: [names, names],
    length: 2,
    separator: " "
  });
}

export default function GenerateData(numberOfData : number) : Data[]
{
  const data : Data[] = new Array<Data>;
  let id = 1
  for (let i: number = 0; i < numberOfData; i++)
  {
    const developers: string[] = new Array<string>;
    for (let j: number = 0; j < (Math.random() * 10 + 1); j++)
    {
      developers.push(generateName());
    }

    data.push({
      productId: id++,
      productName: uniqueNamesGenerator({
        dictionaries: [adjectives, names],
        length: 2,
        style: 'capital',
        separator: " "
      }),
      productOwnerName: generateName(),
      Developers: developers,
      scrumMasterName: generateName(),
      startDate: new Date(Date.now() - (Math.random() * 500000000000) + 1000000000),
      methodology: Math.floor(Math.random() * 2) ? "agile" : "waterfall"
    })
  }
  return data;
}

export const mockData : Data[] = GenerateData(40);