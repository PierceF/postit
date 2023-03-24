// import the EmailInput component into the Filter page
"use client";
// import EmailInput from "@/app/components/EmailInput";
import UserTable from "@/app/components/UserTable";
import QueryWrapper from "@/app/auth/QueryWrapper";

export default function Filter() {
  return (
    <QueryWrapper>
      <div>Users</div>
      <UserTable />
    </QueryWrapper>
  );
}
