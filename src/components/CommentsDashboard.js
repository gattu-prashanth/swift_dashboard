import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../App.css";
import SwiftLogo from "../assests/SWIFTLOGO.svg";

function CommentsDashboard() {
  const [comments, setComments] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [page, setPage] = useState(() => +localStorage.getItem("page") || 1);
  const [pageSize, setPageSize] = useState(() => +localStorage.getItem("pageSize") || 10);
  const [search, setSearch] = useState(() => localStorage.getItem("search") || "");
  const [sort, setSort] = useState(() => JSON.parse(localStorage.getItem("sort")) || { key: null, order: null });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/comments")
      .then(res => res.json())
      .then(data => setComments(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("page", page);
    localStorage.setItem("pageSize", pageSize);
    localStorage.setItem("search", search);
    localStorage.setItem("sort", JSON.stringify(sort));
  }, [page, pageSize, search, sort]);

  useEffect(() => {
    let filtered = comments.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.body.toLowerCase().includes(search.toLowerCase())
    );

    // if (sort.key) {
    //   filtered.sort((a, b) => {
    //     if (sort.order === "asc") return a[sort.key].localeCompare(b[sort.key]);
    //     else if (sort.order === "desc") return b[sort.key].localeCompare(a[sort.key]);
    //     return 0;
    //   });
    // }
    if (sort.key) {
  filtered.sort((a, b) => {
    const valA = a[sort.key];
    const valB = b[sort.key];

    if (typeof valA === "string" && typeof valB === "string") {
      return sort.order === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    if (typeof valA === "number" && typeof valB === "number") {
      return sort.order === "asc" ? valA - valB : valB - valA;
    }

    return 0;
  });
}


    const start = (page - 1) * pageSize;
    setDisplayed(filtered.slice(start, start + pageSize));
  }, [comments, page, pageSize, search, sort]);

  const toggleSort = key => {
    if (sort.key === key) {
      const nextOrder = sort.order === "asc" ? "desc" : sort.order === "desc" ? null : "asc";
      setSort({ key: nextOrder ? key : null, order: nextOrder });
    } else {
      setSort({ key, order: "asc" });
    }
  };
const renderArrow = (key) => {
  if (sort.key !== key) return "";
  return sort.order === "asc" ? "▲" : sort.order === "desc" ? "▼" : "";
};

  return (
    <div>
      <div className="header">
        <img src={SwiftLogo} alt="SWIFT" className="logo-img" />
        <div className="user-circle" onClick={() => navigate("/profile")}>EH</div>
      </div>

      <div className="container">
        <div className="controls">
          <div className="sort-buttons">
            <button onClick={() => toggleSort("postId")}>Sort Post ID</button>
            <button onClick={() => toggleSort("name")}>Sort Name</button>
            <button onClick={() => toggleSort("email")}>Sort Email</button>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="Search name, email, comment"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <table>
          <thead>
            <tr>
                <th onClick={() => toggleSort("postId")}>
                Post ID {renderArrow("postId")}
                </th>
                <th onClick={() => toggleSort("name")}>
                Name {renderArrow("name")}
                </th>
                <th onClick={() => toggleSort("email")}>
                Email {renderArrow("email")}
                </th>
                <th>Comment</th>
            </tr>
            </thead>

          <tbody>
            {displayed.map((c, idx) => (
              <tr key={idx}>
                <td>{c.postId}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.body}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <div>
            {`Showing ${Math.min((page - 1) * pageSize + 1, comments.length)} - ${
              Math.min(page * pageSize, comments.length)
            } of ${comments.length} items`}
          </div>
          <div className="page-buttons">
            {Array.from({ length: Math.ceil(comments.length / pageSize) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                style={{ fontWeight: page === i + 1 ? "bold" : "normal" }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div>
            <select
              className="page-select"
              value={pageSize}
              onChange={e => {
                setPageSize(+e.target.value);
                setPage(1);
              }}
            >
              <option value={10}>10 / Page</option>
              <option value={50}>50 / Page</option>
              <option value={100}>100 / Page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentsDashboard;
