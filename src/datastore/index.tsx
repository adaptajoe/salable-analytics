export type DataRow = {
  id: string;
  productName: string;
  subscriptionMetrics: {
    monthYear: string;
    newSubs: number;
    cancellations: number;
  }[];
};

//NOTE We have two types for data manipulation here; this is so we can split the two purposes (I.E. I may not want to update a password, but do want to update a name and email address)
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
    {
      id: "3c38b430-d0bb-49bf-892b-167dca396a0d",
      productName: "Full Year Data Product - 2024",
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
          newSubs: 230,
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
          monthYear: "Sep 2024",
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
  ];

  //NOTE Get the list of all data in the array; we run a guard statement here to check that data actually exists
  getList(): DataRow[] | null {
    if (!this.data) {
      return null;
    }

    return this.data;
  }

  //NOTE Get the detail from each data entry in the array; using guard statements we check if data exists, and if the id exists; if both pass, return
  getDetail(id: string): DataRow | null {
    if (!this.data) {
      return null;
    }

    if (!id) {
      return null;
    }

    return this.data.find((dataRow) => id === dataRow.id) ?? null;
  }

  //NOTE Post the data out; we don't need to check if index exists here as we're creating a new index, which may be the first piece of data in the array
  post(data: CreateDataRow): DataRow {
    const newDataRow = {
      id: crypto.randomUUID(),
      ...data,
    };

    this.data.push(newDataRow);

    return newDataRow;
  }

  //NOTE Delete this piece of data in the array according to the id
  delete(id: string): void | null {
    const index = this.data.findIndex((row) => row.id === id);

    if (index === -1) {
      return null;
    }

    this.data.splice(index, 1);
  }

  //NOTE Update this piece of data in the array according to the id
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
