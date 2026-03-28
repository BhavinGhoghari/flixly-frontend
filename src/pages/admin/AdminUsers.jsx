import React, { useState, useEffect } from "react";
import {
  Table,
  Avatar,
  Tag,
  Button,
  Popconfirm,
  message,
  Input,
  Modal,
  Descriptions,
  Space,
} from "antd";
import { DeleteOutlined, UserOutlined, EyeOutlined } from "@ant-design/icons";
import API from "../../utils/api";
import dayjs from "dayjs";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      message.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      message.error("Failed to delete");
    }
  };

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar style={{ background: "#e50914", fontWeight: 700 }}>
            {r.name[0].toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: "#fff" }}>{r.name}</div>
            <div style={{ color: "#555", fontSize: "0.75rem" }}>{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (d) => (
        <span style={{ color: "#666", fontSize: "0.85rem" }}>
          {dayjs(d).format("MMM D, YYYY")}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedUser(r);
              setModalOpen(true);
            }}
          >
            View
          </Button>
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => handleDelete(r._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "2rem",
              color: "#fff",
              letterSpacing: 3,
              marginBottom: 0,
            }}
          >
            USERS
          </h1>
          <p style={{ color: "#555", fontSize: "0.85rem" }}>
            {users.length} registered users
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: 300 }}
          allowClear
        />
      </div>

      <div
        style={{
          background: "#111",
          border: "1px solid #1f1f1f",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 15, showSizeChanger: false }}
          scroll={{ x: "max-content" }}
        />
      </div>
      <Modal
        title={<span style={{ color: "#fff" }}>User Details</span>}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={600}
        styles={{
          content: { background: "#1a1a1a", border: "1px solid #2a2a2a" },
          header: { background: "#1a1a1a", borderBottom: "1px solid #2a2a2a" },
        }}
      >
        {selectedUser && (
          <Descriptions
            column={1}
            bordered
            size="small"
            style={{ marginTop: 16 }}
          >
            <Descriptions.Item
              label={<span style={{ color: "#888" }}>ID</span>}
            >
              <span style={{ color: "#ddd", fontSize: "0.8rem" }}>
                {selectedUser._id}
              </span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ color: "#888" }}>Name</span>}
            >
              <span style={{ color: "#fff", fontWeight: 600 }}>
                {selectedUser.name}
              </span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ color: "#888" }}>Email</span>}
            >
              <span style={{ color: "#fff" }}>{selectedUser.email}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ color: "#888" }}>Role</span>}
            >
              <Tag color={selectedUser.role === "admin" ? "red" : "blue"}>
                {selectedUser.role.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ color: "#888" }}>Joined On</span>}
            >
              <span style={{ color: "#ddd" }}>
                {dayjs(selectedUser.createdAt).format("MMMM D, YYYY — HH:mm")}
              </span>
            </Descriptions.Item>
            {selectedUser.updatedAt && (
              <Descriptions.Item
                label={<span style={{ color: "#888" }}>Last Updated</span>}
              >
                <span style={{ color: "#666" }}>
                  {dayjs(selectedUser.updatedAt).format("MMMM D, YYYY — HH:mm")}
                </span>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
