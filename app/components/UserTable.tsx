import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@prisma/client";
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridRowsProp,
  GridSelectionModel,
} from "@mui/x-data-grid";

async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete user ${id}`);
  }
}

function UserTable() {
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const queryClient = useQueryClient();

  async function getUsers(): Promise<User[]> {
    const response = await fetch("/api/users");
    const { data: users } = await response.json();
    return users;
  }

  // Fetch all users from the database
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery<User[]>(["users", selectedRows], getUsers);

  // Define the columns for the table
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
  ];

  // Convert the users array to rows for the table
  const rows: GridRowsProp = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  // Handle row selection
  const handleRowSelection = (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    const selectedUsers = selectionModel.map(
      (id) => rows.find((row) => row.id === id)!
    );
    setSelectedRows(selectedUsers);
  };

  // Delete mutation
  const deleteMutation = useMutation(deleteUser, {
    onSuccess: () => {
      setSelectedRows([]);
      queryClient.invalidateQueries(["users"]);
    },
  });

  // Handle row deletion
  const handleDeleteRows = async () => {
    await Promise.all(
      selectedRows.map(async (user) => {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Failed to delete user ${user.id}`);
        }
      })
    );
    setSelectedRows([]);
    queryClient.invalidateQueries(["users"]);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        onSelectionModelChange={handleRowSelection}
      />
      {selectedRows.length > 0 && (
        <div>
          <span>{selectedRows.length} user(s) selected</span>
          <button onClick={handleDeleteRows}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default UserTable;

// import { useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { User } from "@prisma/client";
// import {
//   DataGrid,
//   GridCallbackDetails,
//   GridColDef,
//   GridRowsProp,
//   GridSelectionModel,
// } from "@mui/x-data-grid";

// function UserTable() {
//   const [selectedRows, setSelectedRows] = useState<User[]>([]);
//   const queryClient = useQueryClient();

//   async function getUsers(): Promise<User[]> {
//     const response = await fetch("/api/users");
//     const { data: users } = await response.json();
//     return users;
//   }

//   // Fetch all users from the database
//   const {
//     data: users = [],
//     isLoading,
//     isError,
//   } = useQuery<User[]>(["users", selectedRows], getUsers);

//   // Define the columns for the table
//   const columns: GridColDef[] = [
//     { field: "id", headerName: "ID", width: 70 },
//     { field: "name", headerName: "Name", width: 200 },
//     { field: "email", headerName: "Email", width: 250 },
//   ];

//   // Convert the users array to rows for the table
//   const rows: GridRowsProp = users.map((user) => ({
//     id: user.id,
//     name: user.name,
//     email: user.email,
//   }));

//   // Handle row selection
//   const handleRowSelection = (
//     selectionModel: GridSelectionModel,
//     details: GridCallbackDetails<any>
//   ) => {
//     const selectedUsers = selectionModel.map(
//       (id) => rows.find((row) => row.id === id)!
//     );
//     setSelectedRows(selectedUsers);
//   };

//   // Handle row deletion
//   const handleDeleteRows = async () => {
//     await Promise.all(
//       selectedRows.map(async (row) => {
//         const response = await fetch(`/api/users/${row.id}`, {
//           method: "DELETE",
//         });
//         if (!response.ok) {
//           throw new Error(`Failed to delete user ${row.id}`);
//         }
//       })
//     );
//     setSelectedRows([]);
//     queryClient.invalidateQueries(["users"]);
//   };

//   return (
//     <div style={{ height: 400, width: "100%" }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         pageSize={5}
//         rowsPerPageOptions={[5]}
//         checkboxSelection
//         onSelectionModelChange={handleRowSelection}
//       />
//       {selectedRows.length > 0 && (
//         <div>
//           <span>{selectedRows.length} user(s) selected</span>
//           <button onClick={handleDeleteRows}>Delete</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserTable;

// import { useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { User } from "@prisma/client";

// function UserTable() {
//   const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const queryClient = useQueryClient();

//   async function getUsers() {
//     const response = await fetch("/api/users");
//     const { data: users } = await response.json();
//     return users;
//   }

//   // Fetch all users from the database
//   const {
//     data: users = [],
//     isLoading,
//     isError,
//   } = useQuery(["users", selectedUsers], getUsers);

//   // Select or deselect all users
//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(users ?? []);
//     }
//     setSelectAll(!selectAll);
//   };

//   // Select or deselect a specific user
//   const handleSelectUser = (user: User) => {
//     if (selectedUsers.includes(user)) {
//       setSelectedUsers(selectedUsers.filter((u) => u !== user));
//     } else {
//       setSelectedUsers([...selectedUsers, user]);
//     }
//   };

//   // Delete selected users
//   const handleDeleteUsers = async () => {
//     await Promise.all(
//       selectedUsers.map(async (user) => {
//         const response = await fetch(`/api/users/${user.id}`, {
//           method: "DELETE",
//         });
//         if (!response.ok) {
//           throw new Error(`Failed to delete user ${user.id}`);
//         }
//       })
//     );
//     setSelectedUsers([]);
//     setSelectAll(false);
//     queryClient.invalidateQueries(["users"]);
//   };

//   return (
//     <>
//       <table>
//         <thead>
//           <tr>
//             <th>
//               <input
//                 type="checkbox"
//                 checked={selectAll}
//                 onChange={handleSelectAll}
//               />
//             </th>
//             <th>Name</th>
//             <th>Email</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users?.map((user) => (
//             <tr key={user.id}>
//               <td>
//                 <input
//                   type="checkbox"
//                   checked={selectedUsers.includes(user)}
//                   onChange={() => handleSelectUser(user)}
//                 />
//               </td>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div>
//         {selectedUsers.length > 0 && (
//           <>
//             <span>{selectedUsers.length} user(s) selected</span>
//             <button onClick={handleDeleteUsers}>Delete</button>
//           </>
//         )}
//       </div>
//     </>
//   );
// }

// export default UserTable;
