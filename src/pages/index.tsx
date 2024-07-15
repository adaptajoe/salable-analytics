import { CreateDataRow, DataRow } from "@/datastore";
import {
  Alert,
  Button,
  Card,
  Label,
  Radio,
  Table,
  TextInput,
} from "flowbite-react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import {
  TbCircleXFilled,
  TbSend,
  TbRefresh,
  TbChevronUp,
  TbChevronDown,
  TbThumbUpFilled,
} from "react-icons/tb";
import useSWR from "swr";
import * as Yup from "yup";

function AnalyticsItem({ data }: { data: DataRow }) {
  const { mutate } = useSWR("/api/items");

  const handleDelete = async () => {
    await fetch(`/api/items/${data.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await mutate();
  };

  if (!data) return null;

  // Change to new format!
  return (
    <Card className="hover:-translate-y-2 hover:bg-gray-50 transition-all">
      <div className="text-center">
        <strong>{data.productName}</strong>
        <span className="text-xs">
          <p>Annual Subs: {data.annualSubscriptions}</p>
          <p>Monthly Subs: {data.monthlySubscriptions}</p>
        </span>
        <fieldset>
          <Radio />
        </fieldset>
      </div>

      <Button color="failure" onClick={handleDelete}>
        Delete
      </Button>
    </Card>
  );
}

export default function SwrAnalyticsExample() {
  const { data, error, isLoading, mutate } = useSWR<DataRow[]>("/api/items");

  const handleSubmit = async (
    values: CreateDataRow,
    actions: FormikHelpers<CreateDataRow>
  ) => {
    await fetch(`/api/items`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await mutate();

    actions.setStatus(null);
    actions.setSubmitting(false);
    actions.resetForm({
      values: {
        productName: "",
        annualSubscriptions: 0,
        monthlySubscriptions: 0,
      },
    });
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleApiView = () => {
    isExpanded ? setIsExpanded(false) : setIsExpanded(true);
  };

  // const [isSelected, setIsSelected] = useState(false);
  // const toggleSelection = () => {
  //   isSelected ? setIsSelected(false) : setIsSelected(true);
  // };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error getting data</p>;

  const FlowbiteInput = ({ field, form, ...props }: any) => {
    return <TextInput {...field} {...props} />;
  };

  return (
    <div className="m-16">
      <Card className="p-4">
        <Formik
          initialValues={{
            productName: "",
            annualSubscriptions: 0,
            monthlySubscriptions: 0,
          }}
          onSubmit={handleSubmit}
          validationSchema={Yup.object({
            productName: Yup.string()
              .min(2, "Product Name must be 2 characters or more.")
              .required("A Product Name is required."),
          })}
        >
          {({ isSubmitting, handleReset, errors, touched }) => (
            <Form className="mb-6">
              <div className="flex">
                <div className="mr-4">
                  <Label htmlFor="name">
                    Product Name<span className="text-red-500">*</span>
                  </Label>
                  <Field
                    placeholder="Cool Product Name"
                    name="productName"
                    component={FlowbiteInput}
                    className="w-[300px]"
                  />
                </div>
              </div>
              <div className="flex flex-row mt-4">
                <div className="mr-4">
                  <Label htmlFor="annualsubs">Annual Subs</Label>
                  <Field
                    placeholder="0"
                    name="annualSubscriptions"
                    type="number"
                    component={FlowbiteInput}
                  />
                </div>

                <div className="mr-4">
                  <Label htmlFor="monthlysubs">Monthly Subs</Label>
                  <Field
                    placeholder="0"
                    name="monthlySubscriptions"
                    className="w-full"
                    type="number"
                    component={FlowbiteInput}
                  />
                </div>
              </div>
              {touched.productName && errors.productName ? (
                <Alert
                  color="failure"
                  icon={TbCircleXFilled}
                  className="mt-4 w-fit"
                >
                  <ErrorMessage name="productName" />
                </Alert>
              ) : null}
              {touched.productName && !errors.productName ? (
                <Alert
                  color="success"
                  icon={TbThumbUpFilled}
                  className="mt-4 w-fit"
                >
                  No errors!
                </Alert>
              ) : null}

              <div className="flex mt-6 mb-4">
                <Button
                  className="mr-4 flex"
                  disabled={isSubmitting}
                  color="purple"
                  onClick={handleReset}
                >
                  Reset Fields
                  <TbRefresh size={20} className="ml-2" />
                </Button>
                <Button
                  type="submit"
                  className="mr-4 flex"
                  disabled={isSubmitting}
                  color="blue"
                >
                  Submit Form
                  <TbSend size={20} className="ml-2" />
                </Button>
              </div>
              <div>
                <Button
                  className="w-fit flex"
                  onClick={toggleApiView}
                  color="dark"
                >
                  {isExpanded ? "Hide" : "Show"} API Data View
                  {isExpanded ? (
                    <TbChevronUp size={20} className="ml-2" />
                  ) : (
                    <TbChevronDown size={20} className="ml-2" />
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        {!data || (!data.length && isExpanded) ? (
          <>
            <hr />
            <Alert
              color="failure"
              icon={TbCircleXFilled}
              className="w-fit my-8"
            >
              Cannot load API Data View due to missing data. Please add a
              Product and try again.
            </Alert>
          </>
        ) : isExpanded ? (
          <>
            <hr />
            <div className="p-1 border rounded-xl bg-gray-50 w-fit my-8">
              <Table striped className="text-xs">
                <Table.Head>
                  <Table.HeadCell>ID</Table.HeadCell>
                  <Table.HeadCell>Product Name</Table.HeadCell>
                  <Table.HeadCell>Annual Subs</Table.HeadCell>
                  <Table.HeadCell>Monthly Subs</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {data?.sort().map((data) => (
                    <Table.Row key={data.id}>
                      <Table.Cell>{data.id}</Table.Cell>
                      <Table.Cell>{data.productName}</Table.Cell>
                      <Table.Cell>{data.annualSubscriptions}</Table.Cell>
                      <Table.Cell>{data.monthlySubscriptions}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </>
        ) : null}
        <hr />
        {!data || !data.length ? (
          <Alert color="failure" icon={TbCircleXFilled} className="w-fit my-4">
            Cannot load Product Cards due to missing data. Please add a Product
            and try again.
          </Alert>
        ) : (
          <div className="flex flex-row flex-wrap my-4">
            {data?.sort().map((data) => (
              <button key={data.id} className="first:ml-0 ml-4 my-2">
                <AnalyticsItem data={data} />
              </button>
            ))}
          </div>
        )}
        <hr />
        <div>
          <p>
            Here we should render bespoke info based on the selected Product
            above.
          </p>
        </div>
      </Card>
    </div>
  );
}
