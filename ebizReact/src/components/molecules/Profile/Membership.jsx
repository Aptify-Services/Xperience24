import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { _get } from "@api/APIClient.js";
import { useStateUser } from "@hooks/useStateUser.js";
import { generateDateMMDDYYYY } from "@utils/generateDateTime.js";
import { DEFAULT_DATE } from "@constants";

import { FormBuilder, Loader } from "..";

function Membership() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {}
  });

  const { reset } = form;

  const user = useStateUser({});
  const UserId = user.LinkId;

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const url = "/v1/ProfilePersons/" + UserId;
      const response = await _get(url, {
        withCredentials: true
      });
      setLoading(false);
      const membershipDetails = response.data;
      // Converting String into Date format for Auto fill the form
      const tempInfo = membershipDetails;
      let tempDate = new Date(tempInfo.joinDate);
      if (generateDateMMDDYYYY(tempDate) === DEFAULT_DATE) {
        tempInfo.joinDate = null;
      } else {
        tempInfo.joinDate = generateDateMMDDYYYY(tempDate);
      }
      tempDate = new Date(tempInfo.duesPaidThrough);
      if (generateDateMMDDYYYY(tempDate) === DEFAULT_DATE) {
        tempInfo.duesPaidThrough = null;
      } else {
        tempInfo.duesPaidThrough = generateDateMMDDYYYY(tempDate);
      }
      reset(tempInfo);
    };
    fetchDetails();
  }, [UserId, reset]);

  const fields = useMemo(
    () => [
      {
        type: "group",
        group: [
          {
            type: "text",
            name: "memberType",
            label: "Member Type",
            disabled: true
          },
          {
            type: "text",
            name: "memberStatus",
            label: "Member Status",
            disabled: true
          }
        ]
      },
      {
        type: "group",
        group: [
          {
            type: "text",
            name: "joinDate",
            label: "Join Date",
            disabled: true
          },
          {
            type: "text",
            name: "duesPaidThrough",
            label: "Dues Paid Through",
            disabled: true
          }
        ]
      }
    ],
    []
  );

  return (
    <div className="mt-4">
      {loading && <Loader />}
      <FormBuilder form={form} fields={fields} />
    </div>
  );
}

export default Membership;
