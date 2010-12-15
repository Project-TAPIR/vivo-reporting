/* $This file is distributed under the terms of the license in /doc/license.txt$ */

package edu.cornell.mannlib.vitro.webapp.visualization.valueobjects;

public class SparklineData {
	
	/*
	 * For now sparklineNumPublicationsText & sparklinePublicationRangeText is left 
	 * as empty but later on we would want to leverage the granularity that this 
	 * provides.
	 * */
	private String sparklineNumPublicationsText = "";
	private String sparklinePublicationRangeText = "";
	
	private Integer earliestRenderedPublicationYear;
	private Integer latestRenderedPublicationYear;
	
	private Integer earliestRenderedGrantYear;
	private Integer latestRenderedGrantYear;
	
	private String table = "";
	
	private String downloadDataLink = "";
	private String fullTimelineNetworkLink = "";
	
	private String downloadCoPIDataLink = "";
	private String fullTimelineCoPINetworkLink  = "";
		
	private String sparklineContent;
	private String sparklineContext;
	
	public String getSparklineNumPublicationsText() {
		return sparklineNumPublicationsText;
	}
	
	public void setSparklineNumPublicationsText(String sparklineNumPublicationsText) {
		this.sparklineNumPublicationsText = sparklineNumPublicationsText;
	}
	
	public String getSparklinePublicationRangeText() {
		return sparklinePublicationRangeText;
	}
	
	public void setSparklinePublicationRangeText(
			String sparklinePublicationRangeText) {
		this.sparklinePublicationRangeText = sparklinePublicationRangeText;
	}
	
	public Integer getEarliestRenderedPublicationYear() {
		return earliestRenderedPublicationYear;
	}
	
	public void setEarliestRenderedPublicationYear(
			Integer earliestRenderedPublicationYear) {
		this.earliestRenderedPublicationYear = earliestRenderedPublicationYear;
	}
	
	public Integer getLatestRenderedPublicationYear() {
		return latestRenderedPublicationYear;
	}
	
	public void setLatestRenderedPublicationYear(
			Integer latestRenderedPublicationYear) {
		this.latestRenderedPublicationYear = latestRenderedPublicationYear;
	}
	
	public String getTable() {
		return table;
	}
	
	public void setTable(String table) {
		this.table = table;
	}
	
	public String getDownloadDataLink() {
		return downloadDataLink;
	}
	
	public void setDownloadDataLink(String downloadDataLink) {
		this.downloadDataLink = downloadDataLink;
	}
	
	public String getFullTimelineNetworkLink() {
		return fullTimelineNetworkLink;
	}
	
	public void setFullTimelineNetworkLink(String fullTimelineNetworkLink) {
		this.fullTimelineNetworkLink = fullTimelineNetworkLink;
	}
	
	public String getSparklineContent() {
		return sparklineContent;
	}
	
	public void setSparklineContent(String shortSparklineContent) {
		this.sparklineContent = shortSparklineContent;
	}

	public String getSparklineContext() {
		return sparklineContext;
	}
	
	public void setSparklineContext(String shortSparklineContext) {
		this.sparklineContext = shortSparklineContext;
	}
	
	public String getDownloadCoPIDataLink() {
		return downloadCoPIDataLink;
	}

	public void setDownloadCoPIDataLink(String downloadCoPIDataLink) {
		this.downloadCoPIDataLink = downloadCoPIDataLink;
	}

	public String getFullTimelineCoPINetworkLink() {
		return fullTimelineCoPINetworkLink;
	}

	public void setFullTimelineCoPINetworkLink(String fullTimelineCoPINetworkLink) {
		this.fullTimelineCoPINetworkLink = fullTimelineCoPINetworkLink;
	}

	public Integer getEarliestRenderedGrantYear() {
		return earliestRenderedGrantYear;
	}

	public void setEarliestRenderedGrantYear(Integer earliestRenderedGrantYear) {
		this.earliestRenderedGrantYear = earliestRenderedGrantYear;
	}

	public Integer getLatestRenderedGrantYear() {
		return latestRenderedGrantYear;
	}

	public void setLatestRenderedGrantYear(Integer latestRenderedGrantYear) {
		this.latestRenderedGrantYear = latestRenderedGrantYear;
	}
	
	
}
