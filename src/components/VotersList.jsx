import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import {
  Users,
  Search,
  Edit3,
  Trash2,
  Save,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserPlus,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
} from "./customUI/Customs";
import { SkeletonDiv } from "./customUI/Customs";

const VoterList = ({ role, isAuthenticated }) => {
  const [voters, setVoters] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("serialNo");
  const [sortOrder, setSortOrder] = useState("asc");
  const [todoVoters, setTodoVoters] = useState(new Set());
  const [loadingTodos, setLoadingTodos] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 50,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Fetch voters with pagination
  const fetchVoters = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}voters`, {
        params: {
          sortBy,
          sortOrder,
          page: pagination.currentPage,
          limit: pagination.pageSize,
          search: searchTerm,
        },
        withCredentials: true,
      });
      setVoters(res.data.data);
      setPagination(res.data.pagination);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch voters");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
    if (isAuthenticated) {
      fetchTodoVoters();
    }
  }, [sortBy, sortOrder, pagination.currentPage, pagination.pageSize, searchTerm, isAuthenticated]);

  // Optimized debounced search function
  const debouncedSearchFunction = useCallback(
    debounce((term) => {
      setSearchTerm(term);
      setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on search
    }, 300),
    []
  );

  // Handle search input
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      debouncedSearchFunction(value);
    },
    [debouncedSearchFunction]
  );

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearchFunction.cancel();
    };
  }, [debouncedSearchFunction]);

  const fetchTodoVoters = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}todos`, {
        withCredentials: true,
      });
      const todoVoterIds = new Set(res.data.map((todo) => todo.voterId._id));
      setTodoVoters(todoVoterIds);
    } catch (err) {
      console.error("Failed to fetch todo voters:", err);
    }
  };

  const handleAddToTodo = async (voterId) => {
    if (!isAuthenticated) {
      setError("Please log in to add voters to your todo list");
      return;
    }

    setLoadingTodos((prev) => ({ ...prev, [voterId]: true }));

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}todos`,
        { voterId },
        { withCredentials: true }
      );

      setTodoVoters((prev) => new Set([...prev, voterId]));
      setSuccessMessage("Voter added to your todo list!");
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add voter to todo list"
      );
    } finally {
      setLoadingTodos((prev) => ({ ...prev, [voterId]: false }));
    }
  };

  const handleRemoveFromTodo = async (voterId) => {
    setLoadingTodos((prev) => ({ ...prev, [voterId]: true }));

    try {
      const todosRes = await axios.get(
        `${import.meta.env.VITE_API_BASE}todos`,
        {
          withCredentials: true,
        }
      );

      const todoItem = todosRes.data.find(
        (todo) => todo.voterId._id === voterId
      );

      if (todoItem) {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE}todos/${todoItem._id}`,
          {
            withCredentials: true,
          }
        );

        setTodoVoters((prev) => {
          const newSet = new Set(prev);
          newSet.delete(voterId);
          return newSet;
        });
        setSuccessMessage("Voter removed from your todo list!");
        setError("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to remove voter from todo list"
      );
    } finally {
      setLoadingTodos((prev) => ({ ...prev, [voterId]: false }));
    }
  };

  const handleEdit = (voter) => {
    setEditing(voter._id);
    setEditForm(voter);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE}voters/${id}`,
        editForm,
        {
          withCredentials: true,
        }
      );
      setEditing(null);
      fetchVoters();
      setSuccessMessage("Voter updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update voter");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this voter?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}voters/${id}`, {
        withCredentials: true,
      });
      fetchVoters();
      setSuccessMessage("Voter deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete voter");
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on sort
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-4 w-4 text-slate-400" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1, // Reset to first page when changing page size
    }));
  };

  const renderTodoButton = useCallback(
    (voter) => {
      const isInTodo = todoVoters.has(voter._id);
      const isLoading = loadingTodos[voter._id];

      if (isInTodo) {
        return (
          <Button
            size="sm"
            variant="success"
            onClick={() => handleRemoveFromTodo(voter._id)}
            disabled={isLoading}
            className="text-xs"
            title="Remove from Todo List"
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <UserCheck className="h-3 w-3" />
            )}
          </Button>
        );
      }

      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAddToTodo(voter._id)}
          disabled={isLoading}
          className="text-xs"
          title="Add to Todo List"
        >
          {isLoading ? (
            <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <UserPlus className="h-3 w-3" />
          )}
        </Button>
      );
    },
    [todoVoters, loadingTodos, handleAddToTodo, handleRemoveFromTodo]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Registered Voters</span>
            <Badge variant="secondary">{pagination.totalCount}</Badge>
          </CardTitle>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-auto min-w-32"
              >
                <option value="serialNo">Serial No.</option>
                <option value="name">Name</option>
                <option value="guardianName">Guardian Name</option>
                <option value="houseNo">House No.</option>
                <option value="houseName">House Name</option>
                <option value="genderAge">Gender/Age</option>
                <option value="idCardNo">ID Card No.</option>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="shrink-0"
              >
                {sortOrder === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search voters..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" className="mb-4">
            {successMessage}
          </Alert>
        )}

        {isLoading && <SkeletonDiv />}

        {voters.length === 0 && !isLoading ? (
          <div className="text-center py-8 text-slate-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium mb-2">No voters found</p>
            <p className="text-sm">
              {searchTerm.trim()
                ? "Try adjusting your search terms."
                : "Start by adding your first voter."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              {!isLoading && (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 font-medium text-slate-700">
                        <button
                          onClick={() => handleSort("serialNo")}
                          className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
                        >
                          <span>Serial No</span>
                          {getSortIcon("serialNo")}
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-slate-700">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
                        >
                          <span>Name</span>
                          {getSortIcon("name")}
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-slate-700">
                        <button
                          onClick={() => handleSort("guardianName")}
                          className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
                        >
                          <span>Guardian's Name</span>
                          {getSortIcon("guardianName")}
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-slate-700">
                        <button
                          onClick={() => handleSort("houseNo")}
                          className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
                        >
                          <span>House No.</span>
                          {getSortIcon("houseNo")}
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-slate-700">
                        <button
                          onClick={() => handleSort("houseName")}
                          className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
                        >
                          <span>House Name</span>
                          {getSortIcon("houseName")}
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-slate-700">
                        <button
                          onClick={() => handleSort("genderAge")}
                          className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
                        >
                          <span>Gender / Age</span>
                          {getSortIcon("genderAge")}
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-slate-700">
                        <button
                          onClick={() => handleSort("idCardNo")}
                          className="flex items-center space-x-1 hover:text-slate-900 transition-colors"
                        >
                          <span>ID Card No.</span>
                          {getSortIcon("idCardNo")}
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-slate-700">
                        {isAuthenticated ? "Todo & Actions" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {voters.map((voter) => (
                      <tr
                        key={voter._id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        {editing === voter._id && role === "admin" ? (
                          <>
                            <td className="py-3 px-2">
                              <Input
                                type="number"
                                name="serialNo"
                                value={editForm.serialNo}
                                onChange={handleChange}
                                className="w-20"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="text"
                                name="name"
                                value={editForm.name}
                                onChange={handleChange}
                                className="min-w-32"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="text"
                                name="guardianName"
                                value={editForm.guardianName}
                                onChange={handleChange}
                                className="min-w-32"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="text"
                                name="houseNo"
                                value={editForm.houseNo}
                                onChange={handleChange}
                                className="w-20"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="text"
                                name="houseName"
                                value={editForm.houseName}
                                onChange={handleChange}
                                className="min-w-24"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="text"
                                name="genderAge"
                                value={editForm.genderAge}
                                onChange={handleChange}
                                className="w-20"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="text"
                                name="idCardNo"
                                value={editForm.idCardNo}
                                onChange={handleChange}
                                className="min-w-32"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdate(voter._id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditing(null)}
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-2 font-mono text-sm">
                              {voter.serialNo}
                            </td>
                            <td className="py-3 px-2 font-medium">
                              {voter.name}
                            </td>
                            <td className="py-3 px-2 text-slate-600">
                              {voter.guardianName}
                            </td>
                            <td className="py-3 px-2 text-slate-600">
                              {voter.houseNo}
                            </td>
                            <td className="py-3 px-2 text-slate-600">
                              {voter.houseName}
                            </td>
                            <td className="py-3 px-2 text-slate-600">
                              {voter.genderAge}
                            </td>
                            <td className="py-3 px-2 font-mono text-sm text-slate-600">
                              {voter.idCardNo}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex space-x-1">
                                {isAuthenticated && renderTodoButton(voter)}
                                {role === "admin" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(voter)}
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDelete(voter._id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
                                {!isAuthenticated && !role && (
                                  <span className="text-sm text-slate-500">
                                    Login to add to todo
                                  </span>
                                )}
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {voters.map((voter) => (
                <div
                  key={voter._id}
                  className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                >
                  {editing === voter._id && role === "admin" ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">
                            Serial No.
                          </label>
                          <Input
                            type="number"
                            name="serialNo"
                            value={editForm.serialNo}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">
                            Name
                          </label>
                          <Input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">
                            Guardian's Name
                          </label>
                          <Input
                            type="text"
                            name="guardianName"
                            value={editForm.guardianName}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">
                            House No.
                          </label>
                          <Input
                            type="text"
                            name="houseNo"
                            value={editForm.houseNo}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">
                            House Name
                          </label>
                          <Input
                            type="text"
                            name="houseName"
                            value={editForm.houseName}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">
                            Gender / Age
                          </label>
                          <Input
                            type="text"
                            name="genderAge"
                            value={editForm.genderAge}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium text-slate-600 mb-1 block">
                            ID Card No.
                          </label>
                          <Input
                            type="text"
                            name="idCardNo"
                            value={editForm.idCardNo}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(voter._id)}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          <Save className="h-3 w-3 mr-2" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditing(null)}
                          className="flex-1"
                        >
                          <XCircle className="h-3 w-3 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-slate-900">
                              {voter.name}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="font-mono text-xs"
                            >
                              #{voter.serialNo}
                            </Badge>
                            {todoVoters.has(voter._id) && (
                              <Badge variant="success" className="text-xs">
                                <UserCheck className="h-3 w-3 mr-1" />
                                In Todo
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-1 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Guardian:</span>{" "}
                              {voter.guardianName}
                            </div>
                            <div>
                              <span className="font-medium">Address:</span>{" "}
                              {voter.houseNo}, {voter.houseName}
                            </div>
                            <div>
                              <span className="font-medium">Gender/Age:</span>{" "}
                              {voter.genderAge}
                            </div>
                            <div>
                              <span className="font-medium">ID:</span>{" "}
                              {voter.idCardNo}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-1 ml-2">
                          {isAuthenticated && renderTodoButton(voter)}
                          {role === "admin" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(voter)}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(voter._id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          {!isAuthenticated && (
                            <div className="text-xs text-slate-500 text-center">
                              Login to add to todo
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {!isLoading && voters.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">
                    Showing {voters.length} of {pagination.totalCount} voters
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={pagination.pageSize.toString()}
                    onChange={handlePageSizeChange}
                    className="w-24"
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </Select>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-slate-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VoterList;