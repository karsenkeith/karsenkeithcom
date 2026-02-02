// Tags enum
const Tags = {
    ARCHAEOLOGY: "Archaeology",
    BIBLICAL_THEOLOGY: "Biblical Theology",
    COVENANT: "Covenant",
    CRITICAL_STUDIES: "Critical Studies",
    EXEGESIS: "Exegesis",
    EXODUS: "Exodus",
    GOSPELS: "Gospels",
    GREEK: "Greek",
    HISTORY: "History",
    ISAIAH: "Isaiah",
    JESUS: "Jesus",
    LANGUAGE: "Language",
    LEADERSHIP: "Leadership",
    MESSIAH: "Messiah",
    NEW_TESTAMENT: "New Testament",
    OLD_TESTAMENT: "Old Testament",
    PARABLES: "Parables",
    PAUL: "Paul",
    PENTATEUCH: "Pentateuch",
    PROPHECY: "Prophecy",
    SCHOLARSHIP: "Scholarship",
    SHEPHERD: "Shepherd",
    SOTERIOLOGY: "Soteriology",
    TEMPLE: "Temple",
    THEOLOGY: "Theology",
    WORSHIP: "Worship"
};

// Articles data structure
// In a real application, this would come from a database or API
const articles = [
    {
        id: 1,
        title: "Shepherding God's People as His Representatives",
        date: "2025-11-09",
        summary: "A biblical survey examining 1 Peter 5:1-4 through the lens of God's shepherding model from Genesis to Revelation.",
        filename: "shepherding-gods-people.html",
        tags: [Tags.NEW_TESTAMENT, Tags.SHEPHERD, Tags.LEADERSHIP],
        featured: true
    },
];
