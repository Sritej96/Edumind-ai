export type KnowledgeChunk = {
  id: string;
  title: string;
  content: string;
  keywords: string[];
};

export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: "java-oop",
    title: "Java Object-Oriented Programming",
    content:
      "Object-Oriented Programming in Java is based on classes and objects. The four major concepts are encapsulation, inheritance, polymorphism, and abstraction. Encapsulation combines data and methods inside a class and controls access using access modifiers. Inheritance allows one class to acquire properties and methods of another class. Polymorphism allows the same method or interface to behave differently depending on the object. Abstraction hides unnecessary implementation details and exposes essential functionality.",
    keywords: [
      "java",
      "oop",
      "object oriented",
      "class",
      "object",
      "inheritance",
      "polymorphism",
      "encapsulation",
      "abstraction",
    ],
  },

  {
    id: "python-pandas",
    title: "Python and Pandas",
    content:
      "Pandas is a Python library commonly used for data manipulation and analysis. A Series represents a one-dimensional labeled structure, while a DataFrame represents data in rows and columns. Common operations include reading CSV files, selecting columns, filtering rows, grouping data, handling missing values, and calculating statistics. The read_csv function can be used to load CSV data into a DataFrame.",
    keywords: [
      "python",
      "pandas",
      "dataframe",
      "series",
      "csv",
      "data analysis",
      "filter",
      "groupby",
      "missing values",
    ],
  },

  {
    id: "sql-basics",
    title: "SQL Fundamentals",
    content:
      "SQL is used to communicate with relational databases. SELECT retrieves data, WHERE filters rows, ORDER BY sorts results, GROUP BY creates groups for aggregate calculations, and JOIN combines related data from multiple tables. Common aggregate functions include COUNT, SUM, AVG, MIN, and MAX. A primary key uniquely identifies a row in a table, while a foreign key can connect a record to another table.",
    keywords: [
      "sql",
      "database",
      "select",
      "where",
      "join",
      "group by",
      "primary key",
      "foreign key",
      "count",
      "sum",
      "average",
    ],
  },

  {
    id: "ohms-law",
    title: "Ohm's Law",
    content:
      "Ohm's Law describes the relationship between voltage, current, and resistance in an electrical circuit. The formula is V = I × R, where V is voltage measured in volts, I is current measured in amperes, and R is resistance measured in ohms. If resistance stays constant, increasing voltage increases current. The formula can also be rearranged as I = V/R and R = V/I.",
    keywords: [
      "ohm",
      "ohm's law",
      "voltage",
      "current",
      "resistance",
      "circuit",
      "electronics",
    ],
  },

  {
    id: "iot",
    title: "Internet of Things",
    content:
      "The Internet of Things, or IoT, connects physical devices to networks so they can collect, exchange, and sometimes process data. A typical IoT system can contain sensors, a microcontroller or edge device, network connectivity, a cloud or server platform, and an application. Sensors collect information from the environment, processing devices handle data, communication technologies transfer information, and applications present or use the resulting data.",
    keywords: [
      "iot",
      "internet of things",
      "sensor",
      "esp32",
      "microcontroller",
      "cloud",
      "device",
      "connectivity",
    ],
  },

  {
    id: "computer-networks",
    title: "Computer Networks",
    content:
      "A computer network allows devices to communicate and share resources. Common concepts include IP addresses, routers, switches, protocols, and client-server communication. TCP provides reliable, connection-oriented communication, while UDP provides connectionless communication with lower overhead. HTTP is an application-layer protocol commonly used for communication between web clients and servers.",
    keywords: [
      "network",
      "computer networks",
      "ip address",
      "router",
      "switch",
      "tcp",
      "udp",
      "http",
      "protocol",
    ],
  },

  {
    id: "data-analytics",
    title: "Data Analytics",
    content:
      "Data analytics involves collecting, cleaning, transforming, analyzing, and communicating data to support understanding and decision-making. A typical workflow includes data collection, data cleaning, exploratory analysis, visualization, and interpretation. Python libraries such as Pandas and NumPy are commonly used for data processing, while Matplotlib can be used for visualization. Power BI and Tableau can be used to build interactive dashboards.",
    keywords: [
      "data analytics",
      "data analysis",
      "pandas",
      "numpy",
      "matplotlib",
      "power bi",
      "tableau",
      "dashboard",
      "visualization",
    ],
  },
];

export function retrieveKnowledge(query: string, limit = 3) {
  const normalizedQuery = query.toLowerCase();

  const words = normalizedQuery
    .split(/[^a-z0-9']+/)
    .filter((word: string) => word.length > 2);

  const scoredChunks = knowledgeBase.map((chunk) => {
    let score = 0;

    for (const keyword of chunk.keywords) {
      const normalizedKeyword = keyword.toLowerCase();

      if (normalizedQuery.includes(normalizedKeyword)) {
        score += 5;
      }

      for (const word of words) {
        if (
          normalizedKeyword === word ||
          normalizedKeyword.includes(word) ||
          word.includes(normalizedKeyword)
        ) {
          score += 1;
        }
      }
    }

    const titleWords = chunk.title.toLowerCase().split(/\s+/);

    for (const word of words) {
      if (titleWords.includes(word)) {
        score += 2;
      }
    }

    return {
      chunk,
      score,
    };
  });

  return scoredChunks
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.chunk);
}