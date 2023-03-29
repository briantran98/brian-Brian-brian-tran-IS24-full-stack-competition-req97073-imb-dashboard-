import { uniqueNamesGenerator, names, adjectives } from 'unique-names-generator';
import { Product } from '@/interfaces/index';
import crypto from 'crypto';

const generateName = (): string =>
{
  return uniqueNamesGenerator({
    dictionaries: [names, names],
    length: 2,
    separator: " "
  });
};

export default function GenerateData(numberOfData : number) : Product[]
{
  const data : Product[] = new Array<Product>;
  let id = 1;
  for (let i: number = 0; i < numberOfData; i++)
  {
    const developers: string[] = new Array<string>;
    for (let j: number = 0; j < (Math.random() * 10 + 1); j++)
    {
      developers.push(generateName());
    }

    data.push({
      productId: crypto.randomUUID().split("-")[0],
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
      methodology: Math.floor(Math.random() * 2) ? "Agile" : "Waterfall"
    });
  }
  return data;
}

export const mockData : Product[] = GenerateData(40);