export type DataRow = {
  id: string;
  productName: string;
  annualSubscriptions: number;
  monthlySubscriptions: number;
};

//? We have two types for data manipulation here; this is so we can split the two purposes (I.E. I may not want to update a password, but do want to update a name and email address)
export type CreateDataRow = Omit<DataRow, "id">;
export type UpdateDataRow = Omit<DataRow, "id">;

//? We can stub data by just including it in the array; for instance...
/*
  data: DataRow[] = [
    {
      id: "ccc3f8c6-cd6a-43ad-8af1-0aae0ce34622",
      productName: "My First Product",
      annualSubscriptions: 12,
      monthlySubscriptions: 1,
    },
  ];
*/

export class DataApi {
  data: DataRow[] = [
    {
      id: "ccc3f8c6-cd6a-43ad-8af1-0aae0ce34622",
      productName: "Stubbed Product Alpha",
      annualSubscriptions: 12,
      monthlySubscriptions: 1,
    },
    {
      id: "2099affa-5c33-4ad6-b307-17a9785a5d21",
      productName: "Stubbed Product Beta",
      annualSubscriptions: 24,
      monthlySubscriptions: 2,
    },
    {
      id: "3c38b430-d0bb-49bf-892b-167dca396a0d",
      productName: "Stubbed Product Gamma",
      annualSubscriptions: 36,
      monthlySubscriptions: 3,
    },
    {
      id: "47706dc4-7ec9-4e81-8ca7-f4de36e1c7f8",
      productName: "Stubbed Product Sigma",
      annualSubscriptions: 48,
      monthlySubscriptions: 4,
    },
    {
      id: "94ceadef-9a05-41e9-b821-edc6f5e60fe8",
      productName: "Stubbed Product Omega",
      annualSubscriptions: 60,
      monthlySubscriptions: 5,
    },
    {
      id: "38d38d6e-8b8a-43df-955e-dc02fe75a74a",
      productName: "Stubbed Product Omega",
      annualSubscriptions: 72,
      monthlySubscriptions: 6,
    },
    {
      id: "f0b48e04-1a94-4c5c-8d9a-9645ef20d14e",
      productName: "Stubbed Product Zeta",
      annualSubscriptions: 84,
      monthlySubscriptions: 7,
    },
  ];

  //? Get the list of all data in the array; we run a guard statement here to check that data actually exists
  getList(): DataRow[] | null {
    if (!this.data) {
      return null;
    }

    return this.data;
  }

  //? Get the detail from each data entry in the array; using guard statements we check if data exists, and if the id exists; if both pass, return
  getDetail(id: string): DataRow | null {
    //TODO: Make sure the id exists in the array before trying to return it
    if (!this.data) {
      return null;
    }

    if (!id) {
      return null;
    }

    return this.data.find((dataRow) => id === dataRow.id) ?? null;
  }

  //? Post the data out; we don't need to check if index exists here as we're creating a new index, which may be the first piece of data in the array
  post(data: CreateDataRow): DataRow {
    const newDataRow = {
      id: crypto.randomUUID(),
      ...data,
    };

    this.data.push(newDataRow);

    return newDataRow;
  }

  //? Delete this piece of data in the array according to the id
  delete(id: string): void | null {
    const index = this.data.findIndex((row) => row.id === id);

    if (index === -1) {
      return null;
    }

    this.data.splice(index, 1);
  }

  //? Update this piece of data in the array according to the id
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
