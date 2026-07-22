import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeFormData } from "@/lib/resume-schema";

// Create styles for the PDF incorporating light blue and light yellow
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    color: "#333",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    backgroundColor: "#e0f2fe", // Light blue background
    padding: 20,
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#0369a1", // Darker blue to ensure contrast against the light blue
  },
  role: {
    fontSize: 14,
    color: "#0284c7",
    marginBottom: 8,
  },
  contact: {
    fontSize: 10,
    color: "#475569",
    flexDirection: "row",
    gap: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0369a1",
    textTransform: "uppercase",
    borderBottom: "2px solid #fef9c3", // Light yellow underline
    paddingBottom: 4,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  entryTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  entryMeta: {
    fontSize: 10,
    color: "#666",
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillItem: {
    fontSize: 11,
    backgroundColor: "#fef9c3", // Light yellow background
    color: "#854d0e", // Darker text for readability on yellow
    padding: "4px 8px",
    borderRadius: 4,
  },
});

export function ResumePDF({ data }: { data: ResumeFormData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName}</Text>
          <Text style={styles.role}>{data.role}</Text>
          <View style={styles.contact}>
            <Text>{data.email}</Text>
            <Text>{data.phone}</Text>
            <Text>{data.city}</Text>
          </View>
        </View>

        {/* General Description */}
        {data.generalDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INtrodução</Text>
            <Text style={styles.text}>{data.generalDescription}</Text>
          </View>
        )}

        {/* Experience Section */}
        {data.experiences && data.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiência Profissional</Text>
            {data.experiences.map((exp, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.position} at {exp.company}</Text>
                  <Text style={styles.entryMeta}>
                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.text}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {data.educations && data.educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiência Acadêmica</Text>
            {data.educations.map((edu, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu!.courseType} {edu!.area ? `- ${edu!.area}` : ""}</Text>
                  <Text style={styles.entryMeta}>
                    {edu!.startDate} - {edu!.isCurrent ? "Present" : edu!.endDate}
                  </Text>
                </View>
                <Text style={styles.text}>{edu!.institution}</Text>
                {edu!.description && <Text style={styles.text}>{edu!.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidade</Text>
            <View style={styles.skillContainer}>
              {data.skills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  {skill.name} - {skill.level}
                </Text>
              ))}
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
}
