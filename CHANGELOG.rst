##########
Change log
##########

2.3.3 (2021-06-22)
==================

- **Uses Firefly release-2021.2.3**  See the `Firefly release notes <https://github.com/Caltech-IPAC/firefly/blob/dev/docs/release-notes.md>`.  Key RSP-relevant features:

  - Fixed: initialization of userInfo object
  - Fixed: refinement to redirect/auth handling when retrieving TAP error documents
  - Fixed: Simbad name resolution issue (Firefly-797)
  - Fixed: Mouse zoom not working correctly (Firefly-803)


2.3.2 (2021-06-16)
====================

- Replace original LSST logo with transparent colored Rubin version.


2.3.1 (2021-06-15)
==================

- **Uses Firefly release-2021.2.2**  See the `Firefly release notes <https://github.com/Caltech-IPAC/firefly/blob/dev/docs/release-notes.md>`.  Key RSP-relevant features:

  - Fixed: mouse wheel / trackpad scrolling performance issue (Firefly-793)
    [`FIREFLY-793 <https://jira.ipac.caltech.edu/browse/FIREFLY-793>`_]

  - Fixed: Handle redirects when retrieving TAP errors (DM-30073)
    [`DM-30073 <https://jira.lsstcorp.org/browse/DM-30073>`_]


2.3.0 (2021-06-10)
==================

- Remove "Legacy PDAC" button from UI (invokes LsstCatalogDropDown); permanently retired

- **Uses Firefly release-2021.2.1**  See the `Firefly release notes <https://github.com/Caltech-IPAC/firefly/blob/dev/docs/release-notes.md>`.  Key RSP-relevant features:

  - ObsTAP-specific search capabilities

  - Spectral data viewer (based on IVOA SpectrumDM v1.1 with IRSA enhancements that have been proposed to the IVOA)

  - Clarifications to the multi-trace UI for working with multiple charts and multiple plot traces per chart; improvements in color selection

  - Improvements to the cleanup interval for Docker deployments

  - Updates to the standard list of TAP services

- Updates for compatibility of `suit` with that release.


2.2.0 (2021-04-28)
==================

- Updates to compatibility with Gafaelfawr 2.0; understood to remain compatible with the previous production version as well.

- No change to Firefly version.


2.1.1 (2021-04-07)
==================

- **Uses Firefly release-2020.3.3**  See the `Firefly release notes <https://github.com/Caltech-IPAC/firefly/blob/dev/docs/release-notes.md>`.  Key LSST-relevant fix:

  - Charts in "expanded mode" do not update after options changes
    [`FIREFLY-525 <https://jira.ipac.caltech.edu/browse/FIREFLY-525>`_]

- Changes URLs for interaction with the authentication to use Gafaelfawr ones.

2.1.0 (2020-10-05)
==================

- **Uses Firefly release-2020.3.0**  See the `Firefly release notes <https://github.com/Caltech-IPAC/firefly/blob/dev/docs/release-notes.md>`.  Key LSST-relevant features:

  - Bug fixes for Python-driven plotting and Slate

  - Improvements to the TAP query interface ADQL-creation screen UI
    [`Firefly-596 <https://jira.ipac.caltech.edu/browse/FIREFLY-596>`_]

  - Initial version of URL API
    [`Firefly-568 <https://jira.ipac.caltech.edu/browse/FIREFLY-568>`_]

  - Improvements to handling of long table cell values
    [`Firefly-524 <https://jira.ipac.caltech.edu/browse/FIREFLY-524>`_]

2.0.0 (2020-08-24)
==================

- **Uses Firefly release-2020.2.0.**  See the `Firefly release notes <https://github.com/Caltech-IPAC/firefly/blob/dev/docs/release-notes.md>`.  Key LSST-relevant features:

  - Better management of Web Sockets
    [`Firefly-521 <https://jira.ipac.caltech.edu/browse/FIREFLY-521>`_]

  - Change tri-view Layout
    [`Firefly-533 <https://jira.ipac.caltech.edu/browse/FIREFLY-533>`_]

  - Table Options UI Improvements (from release-2020.1): New Advanced Filter tab enabling SQL-like filtering; New Table Meta tab showing meta information that was once not accessible; Added additional column metadata when available.
    [`Firefly-471 <https://jira.ipac.caltech.edu/browse/FIREFLY-471>`_]

  - Significant improvements in Data Products Viewing (from release-2020.1): Can choose from any HDU in FITS; Table HDUs are show as table and Charts; Firefly now reads 1D FITS images and shows as a chart; Choice of table with VO Tables; PDF and TAR are recognized and downloadable.
    [`Firefly-460 <https://jira.ipac.caltech.edu/browse/FIREFLY-460>`_]

  - Table data is now formatted on the client side (from release-2019.4.0).
    [`DM-20248 <https://jira.lsst.org/browse/DM-20248>`_]  Enables:

  - Fixed bug in LSST footprint visualization, introduced in last release.
    [Firefly-435 and `DM-22124 <https://jira.lsst.org/browse/DM-22124>`_]

  - Significant improvements in the distance tool.
    [`Firefly-56 <https://jira.ipac.caltech.edu/browse/FIREFLY-56>`_]

- Applied migration needed for move of ``getRootURL`` to ``firefly/util/WebUtil.js`` in the underlying Firefly release.

- Switched to new online help system

1.1.1 (2019-12-03)
==================

- Activated Firefly-release-pinning mechanism (NB: only on release branches of ``suit``).  Improved messaging when the LSP-local TAP service cannot be reliably inferred.
  [`DM-22455 <https://jira.lsst.org/browse/DM-22455>`_]

- Started automatically computing the TAP service URL from the base URL of the LSP instance, and ensured that this works correctly when Firefly is invoked within the Notebook Aspect (as a JupyterLab extension).
  [`DM-21846 <https://jira.lsst.org/browse/DM-21846>`_]
  [`DM-22331 <https://jira.lsst.org/browse/DM-22331>`_]

- **Uses Firefly release-2019.3.2.**  See the `Firefly release notes <https://github.com/Caltech-IPAC/firefly/blob/dev/docs/release-notes.md>`.  Key LSST-relevant features:

  - Build scripts support release-pinning in application packages.
    [`DM-20931 <https://jira.lsst.org/browse/DM-20931>`_]

  - TAP logic conforms to LSST requirements for including Authorization: headers when TAP result URLs are redirected.
    [`DM-21921 <https://jira.lsst.org/browse/DM-21921>`_]

- Known bugs:

  - A change in table handling in Firefly 2019.3.x inadvertently broke the LSST detection footprint visualization capability.  Will be fixed in the next major Firefly release.
