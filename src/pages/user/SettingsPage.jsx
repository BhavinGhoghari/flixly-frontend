import React, { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Avatar,
  List,
  Rate,
  Typography,
  Tag,
  Empty,
  Popconfirm,
  Divider,
  Space,
  App,
  theme as antTheme,
  Grid,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  DeleteOutlined,
  UploadOutlined,
  SafetyCertificateOutlined,
  CommentOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const { message } = App.useApp();
  const { token } = antTheme.useToken();
  const screens = useBreakpoint();
  
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Laptop and Tablet view same layout: only phones (xs) get the mobile view
  const isMobile = !screens.sm; // xs
  const isXs = !screens.sm;
  const tabPosition = isMobile ? "top" : "left";

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        avatar: user.avatar,
      });
    }
    if (activeTab === "reviews") {
      fetchMyReviews();
    }
  }, [user, activeTab, profileForm]);

  const fetchMyReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await API.get("/reviews/my");
      setReviews(res.data);
    } catch (err) {
      message.error("Failed to fetch reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const res = await API.put("/auth/update-profile", values);
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      localStorage.setItem("flixly_user", JSON.stringify(updatedUser));
      message.success("Profile updated successfully");
    } catch (err) {
      message.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      await API.put("/auth/change-password", values);
      message.success("Password changed successfully");
      passwordForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || "Change password failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/reviews/${reviewId}`);
      message.success("Review deleted");
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      message.error("Delete failed");
    }
  };

  const styles = {
    wrapper: {
      // Consistent padding for tablet and laptop (md, lg, xl)
      padding: isMobile ? "80px 16px 40px" : "110px 5% 60px",
      minHeight: "100vh",
      background: `radial-gradient(circle at top right, ${token.colorPrimary}1a, ${token.colorBgBase} 50%)`,
      color: token.colorText,
    },
    header: {
      marginBottom: isMobile ? 24 : 48,
      maxWidth: 1200,
      margin: "0 auto",
      textAlign: isMobile ? "center" : "left",
    },
    title: {
      color: token.colorText,
      fontWeight: 800,
      letterSpacing: "-0.5px",
      marginBottom: 8,
      fontSize: isMobile ? "1.75rem" : "2.5rem",
      textShadow: `0 4px 20px ${token.colorPrimary}26`,
    },
    subtitle: {
      color: token.colorTextDescription,
      fontSize: isMobile ? "0.9rem" : "1.1rem",
    },
    container: {
      maxWidth: 1200,
      margin: "0 auto",
    },
    mainCard: {
      background: "rgba(20, 20, 20, 0.7)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      borderRadius: isMobile ? 12 : 20,
      boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
      overflow: "hidden",
    },
    tabContent: {
      padding: isMobile ? "24px 16px" : "40px 60px",
      maxWidth: 900,
    },
    profileHeader: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      gap: isMobile ? 20 : 40,
      marginBottom: 32,
      textAlign: isMobile ? "center" : "left",
    },
    avatar: {
      border: `4px solid ${token.colorPrimary}cc`,
      background: token.colorBgContainer,
      boxShadow: `0 10px 30px ${token.colorPrimary}40`,
      flexShrink: 0,
    },
    profileName: {
      color: token.colorText,
      fontWeight: 700,
      fontSize: isMobile ? "1.5rem" : "2rem",
      margin: 0,
    },
    reviewCard: {
      background: "rgba(30, 30, 30, 0.4)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      marginBottom: 20,
      borderRadius: 16,
    },
    reviewLayout: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "center" : "flex-start",
      gap: 24,
      textAlign: isMobile ? "center" : "left",
    },
    poster: {
      width: isMobile ? 120 : 110,
      height: isMobile ? 180 : 165,
      objectFit: "cover",
      borderRadius: 12,
      boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
      flexShrink: 0,
    },
    reviewContent: {
      background: "rgba(0, 0, 0, 0.3)",
      padding: isMobile ? 14 : 18,
      borderRadius: 12,
      borderLeft: `4px solid ${token.colorPrimary}`,
      marginTop: 15,
      fontSize: "1rem",
      lineHeight: 1.6,
      color: token.colorTextSecondary,
    },
    input: {
      background: "rgba(0, 0, 0, 0.3)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      color: token.colorText,
      padding: "12px 16px",
      borderRadius: 10,
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case "avoid": return "#ff4d4f";
      case "time-pass": return "#fa8c16";
      case "one-time-watch": return "#fadb14";
      case "go-for-it": return "#52c41a";
      case "must-watch": return "#1677ff";
      case "masterpiece": return "#722ed1";
      default: return token.colorPrimary;
    }
  };

  const items = [
    {
      key: "profile",
      label: (
        <span>
          <UserOutlined /> {isMobile ? "" : "Profile"}
        </span>
      ),
      children: (
        <div style={styles.tabContent}>
          <div style={styles.profileHeader}>
            <Avatar
              size={120}
              src={user?.avatar}
              icon={<UserOutlined />}
              style={styles.avatar}
            />
            <div>
              <Title level={3} style={styles.profileName}>
                {user?.name}
              </Title>
              <Text style={styles.subtitle}>{user?.email}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color={user?.role === "admin" ? "red" : "blue"}>
                  {user?.role?.toUpperCase()}
                </Tag>
              </div>
            </div>
          </div>

          <Divider style={{ borderColor: "rgba(255,255,255,0.05)" }} />

          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleUpdateProfile}
          >
            <Form.Item
              label={
                <span style={{ color: token.colorTextDescription, fontWeight: 600 }}>
                  Display Name
                </span>
              }
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input prefix={<EditOutlined />} style={styles.input} />
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: token.colorTextDescription, fontWeight: 600 }}>
                  Avatar URL
                </span>
              }
              name="avatar"
              help="Enter an image URL for your profile picture"
            >
              <Input prefix={<UploadOutlined />} style={styles.input} />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{
                  height: 50,
                  borderRadius: 10,
                  background: token.colorPrimary,
                  border: "none",
                  fontWeight: 600,
                  marginTop: 12,
                }}
              >
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "reviews",
      label: (
        <span>
          <CommentOutlined /> {isMobile ? "" : "Reviews"}
        </span>
      ),
      children: (
        <div style={styles.tabContent}>
          <List
            loading={reviewsLoading}
            dataSource={reviews}
            locale={{
              emptyText: (
                <Empty description={<span style={{ color: "#555" }}>No reviews yet</span>} />
              ),
            }}
            renderItem={(review) => (
              <Card style={styles.reviewCard} bodyStyle={{ padding: isMobile ? 16 : 24 }}>
                <div style={styles.reviewLayout}>
                  <img
                    src={
                      review.movie?.posterUrl ||
                      "https://via.placeholder.com/100x150?text=No+Poster"
                    }
                    alt={review.movie?.title}
                    style={styles.poster}
                  />
                  <div style={{ flex: 1, width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <Title level={4} style={{ color: "#fff", margin: 0, fontSize: isMobile ? "1.1rem" : "1.3rem" }}>
                        {review.movie?.title}
                      </Title>
                      <Popconfirm
                        title="Delete Review?"
                        onConfirm={() => handleDeleteReview(review._id)}
                      >
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          style={{ padding: 4 }}
                        />
                      </Popconfirm>
                    </div>
                    <Space style={{ marginTop: 8, flexWrap: "wrap" }}>
                      <Rate
                        disabled
                        count={10}
                        defaultValue={review.rating}
                        style={{ fontSize: 13 }}
                      />
                      <Tag
                        color={getVerdictColor(review.verdict)}
                        style={{ border: "none", fontWeight: 600, textTransform: 'uppercase', fontSize: "11px" }}
                      >
                        {review.verdict}
                      </Tag>
                    </Space>
                    <div style={styles.reviewContent}>
                      <Text italic style={{ color: token.colorTextSecondary }}>
                        "{review.message}"
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          />
        </div>
      ),
    },
    {
      key: "security",
      label: (
        <span>
          <SafetyCertificateOutlined /> {isMobile ? "" : "Security"}
        </span>
      ),
      children: (
        <div style={styles.tabContent}>
          <div style={{ marginBottom: 32 }}>
            <Title level={4} style={{ color: "#fff", margin: 0 }}>
              <LockOutlined /> Change Password
            </Title>
            <Text type="secondary" style={{ fontSize: "1rem" }}>
              Keep your account secure by updating your password regularly.
            </Text>
          </div>
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              label={
                <span style={{ color: token.colorTextDescription, fontWeight: 600 }}>
                  Current Password
                </span>
              }
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} style={styles.input} />
            </Form.Item>
            <Form.Item
              label={
                <span style={{ color: token.colorTextDescription, fontWeight: 600 }}>
                  New Password
                </span>
              }
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} style={styles.input} />
            </Form.Item>
            <Form.Item
              label={
                <span style={{ color: token.colorTextDescription, fontWeight: 600 }}>
                  Confirm New Password
                </span>
              }
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} style={styles.input} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                danger
                loading={loading}
                block
                size="large"
                style={{ height: 50, borderRadius: 10, fontWeight: 600, marginTop: 12 }}
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <Title level={2} style={styles.title}>
          Account Settings
        </Title>
        <Text style={styles.subtitle}>Manage your profile, reviews and security</Text>
      </div>

      <div style={styles.container}>
        <Card style={styles.mainCard} bodyStyle={{ padding: 0 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            tabPosition={tabPosition}
            style={{ color: "#fff" }}
            centered={isMobile}
          />
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
