export type DataRow = {
  id: string;
  productName: string;
  subscriptionMetrics: {
    monthYear: string;
    newSubs: number;
    cancellations: number;
  }[];
};

export type CreateDataRow = Omit<DataRow, "id">;
export type UpdateDataRow = Omit<DataRow, "id">;

//NOTE We can stub data by just including it in the array; for instance...
/*
    {
      id: "ccc3f8c6-cd6a-43ad-8af1-0aae0ce34622",
      productName: "Quarterly Data Product - Q1/2024",
      subscriptionMetrics: [
        {
          monthYear: "Jan 2024",
          newSubs: 200,
          cancellations: 20,
        },
        {
          monthYear: "Feb 2024",
          newSubs: 40,
          cancellations: 10,
        },
        {
          monthYear: "Mar 2024",
          newSubs: 10,
          cancellations: 300,
        },
      ],
    },
*/

export class DataApi {
  data: DataRow[] = [
    {
      id: "ccc3f8c6-cd6a-43ad-8af1-0aae0ce34622",
      productName: "Stub Historic Product - Q1/2024",
      subscriptionMetrics: [
        {
          monthYear: "Jan 2024",
          newSubs: 200,
          cancellations: 20,
        },
        {
          monthYear: "Feb 2024",
          newSubs: 40,
          cancellations: 10,
        },
        {
          monthYear: "Mar 2024",
          newSubs: 310,
          cancellations: 300,
        },
      ],
    },
    {
      id: "ccc3f8c6-cd6a-43ad-8af1-0aae0ce34622",
      productName: "Stub Single Month Product for month of Jan 2024",
      subscriptionMetrics: [
        {
          monthYear: "Jan 2024",
          newSubs: 200,
          cancellations: 20,
        },
      ],
    },
    {
      id: "3c38b430-d0bb-49bf-892b-167dca396a0d",
      productName: "Stub Live Product - 2024",
      subscriptionMetrics: [
        {
          monthYear: "Jan 2024",
          newSubs: 200,
          cancellations: 30,
        },
        {
          monthYear: "Feb 2024",
          newSubs: 120,
          cancellations: 70,
        },
        {
          monthYear: "Mar 2024",
          newSubs: 90,
          cancellations: 40,
        },
        {
          monthYear: "Apr 2024",
          newSubs: 250,
          cancellations: 120,
        },
        {
          monthYear: "May 2024",
          newSubs: 330,
          cancellations: 300,
        },
        {
          monthYear: "Jun 2024",
          newSubs: 400,
          cancellations: 150,
        },
        {
          monthYear: "Jul 2024",
          newSubs: 220,
          cancellations: 60,
        },
        {
          monthYear: "Aug 2024",
          newSubs: 0,
          cancellations: 0,
        },
        {
          monthYear: "Sept 2024",
          newSubs: 0,
          cancellations: 0,
        },
        {
          monthYear: "Oct 2024",
          newSubs: 0,
          cancellations: 0,
        },
        {
          monthYear: "Nov 2024",
          newSubs: 0,
          cancellations: 0,
        },
        {
          monthYear: "Dec 2024",
          newSubs: 0,
          cancellations: 0,
        },
      ],
    },
    {
      id: "3c38b430-d0bb-49bf-892b-167dca396a0d",
      productName: "Stub Multi-Year Product - 2022-2023",
      subscriptionMetrics: [
        {
          monthYear: "Jan 2022",
          newSubs: 200,
          cancellations: 30,
        },
        {
          monthYear: "Feb 2022",
          newSubs: 100,
          cancellations: 15,
        },
        {
          monthYear: "Mar 2022",
          newSubs: 400,
          cancellations: 30,
        },
        {
          monthYear: "Apr 2022",
          newSubs: 450,
          cancellations: 200,
        },
        {
          monthYear: "May 2022",
          newSubs: 1200,
          cancellations: 130,
        },
        {
          monthYear: "Jun 2022",
          newSubs: 2100,
          cancellations: 320,
        },
        {
          monthYear: "Jul 2022",
          newSubs: 2000,
          cancellations: 1500,
        },
        {
          monthYear: "Aug 2022",
          newSubs: 1100,
          cancellations: 986,
        },
        {
          monthYear: "Sep 2022",
          newSubs: 1243,
          cancellations: 1122,
        },
        {
          monthYear: "Oct 2022",
          newSubs: 788,
          cancellations: 162,
        },
        {
          monthYear: "Nov 2022",
          newSubs: 314,
          cancellations: 12,
        },
        {
          monthYear: "Dec 2022",
          newSubs: 1244,
          cancellations: 413,
        },
        {
          monthYear: "Jan 2023",
          newSubs: 967,
          cancellations: 586,
        },
        {
          monthYear: "Feb 2023",
          newSubs: 865,
          cancellations: 812,
        },
        {
          monthYear: "Mar 2023",
          newSubs: 232,
          cancellations: 123,
        },
        {
          monthYear: "Apr 2023",
          newSubs: 976,
          cancellations: 856,
        },
        {
          monthYear: "May 2023",
          newSubs: 413,
          cancellations: 64,
        },
        {
          monthYear: "Jun 2023",
          newSubs: 1244,
          cancellations: 1124,
        },
        {
          monthYear: "Jul 2023",
          newSubs: 1423,
          cancellations: 245,
        },
        {
          monthYear: "Aug 2023",
          newSubs: 2532,
          cancellations: 412,
        },
        {
          monthYear: "Sep 2023",
          newSubs: 1242,
          cancellations: 1200,
        },
        {
          monthYear: "Oct 2023",
          newSubs: 1441,
          cancellations: 142,
        },
        {
          monthYear: "Nov 2023",
          newSubs: 2453,
          cancellations: 2144,
        },
        {
          monthYear: "Dec 2023",
          newSubs: 1435,
          cancellations: 1224,
        },
      ],
    },
  ];

  getList(): DataRow[] | null {
    if (!this.data) {
      return null;
    }

    return this.data;
  }

  getDetail(id: string): DataRow | null {
    if (!this.data) {
      return null;
    }

    if (!id) {
      return null;
    }

    return this.data.find((dataRow) => id === dataRow.id) ?? null;
  }

  post(data: CreateDataRow): DataRow {
    const newDataRow = {
      id: crypto.randomUUID(),
      ...data,
    };

    this.data.push(newDataRow);
    return newDataRow;
  }

  delete(id: string): void | null {
    const index = this.data.findIndex((row) => row.id === id);
    if (index === -1) {
      return null;
    }

    this.data.splice(index, 1);
  }

  put(id: string, data: UpdateDataRow): void | null {
    const index = this.data.findIndex((row) => row.id === id);
    if (index === -1) {
      return null;
    }

    this.data[index] = {
      id,
      ...data,
    };
  }
}

export const dataApi = new DataApi();
