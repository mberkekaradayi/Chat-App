"use client";

import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import Link from "next/link";

export default function Sidebar({ contacts, onSelectContact, userEmail }) {
  // State to store the search term
  const [searchTerm, setSearchTerm] = useState("");

  // Filter contacts based on the search term
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-1/4 h-full bg-gray-800 text-white flex flex-col p-4 relative">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        {/* Home Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-gray-100 transition"
        >
          <FaHome size={24} />
          <span className="font-semibold text-lg">Home</span>
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <MdOutlineAccountCircle size={24} className="text-blue-400" />
          <div>
            <div className="text-base font-medium text-slate-300">
              {userEmail || "Guest"}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold mb-4 text-center">Chats</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Contact List */}
      <div className="flex-grow overflow-y-auto space-y-2">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center p-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
              onClick={() => onSelectContact(contact)}
            >
              {/* Avatar */}
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              {/* Text Content */}
              <div className="flex-grow">
                <div className="font-semibold text-sm">{contact.name}</div>
                {contact.isGroup && (
                  <span className="text-xs text-blue-400">(Group)</span>
                )}
              </div>
              {/* Status */}
              {contact.status && (
                <span
                  className={`text-xs font-medium ${
                    contact.status === "online"
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {contact.status}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">
            No contacts match your search.
          </div>
        )}
      </div>
    </div>
  );
}
